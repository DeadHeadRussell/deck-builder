import 'babel/polyfill';

import bodyParser from 'body-parser';
import compression from 'compression';
import {EventEmitter} from 'events';
import express from 'express';
import logger from 'morgan';
import session from 'express-session';
import socketio from 'socket.io';

import names from './names';
import Pack from '../js/models/pack'

let app = express();
let server = app.listen(9001);
let io = socketio(server);

let sessionRoute = session({
  name: 'mtg',
  secret: '12345',
  cookie: {secure: false}
});

app.use(sessionRoute);
app.use(logger());
app.use(compression());
app.use(express.static('./public'));
io.use((socket, next) => sessionRoute(socket.request, {}, next));

app.get('/peek', (req, res) => res.json(Draft.DRAFTS));

io.of('/draft').on('connection', socket => {
  let name = names[Math.floor(Math.random() * names.length)];
  let player = new Player(name);

  if (!socket.request.session.player) {
    socket.request.session.player = player;
    socket.request.session.save();
  } else {
    player.name = socket.request.session.player.name;
    player.drafts = socket.request.session.player.drafts;
  }

  socket.join('draftList');
  socket.emit('draftList', Draft.GET_LIST());
  socket.emit('history', player.getHistory());
  process.nextTick(() => player.onReconnect());

  socket.on('rc', data => {
    let draft = Draft.GET(data.draftId);
    player.rc(draft);
  });

  socket.on('create', data => {
    let draft = Draft.ADD(data.name);
    player.joinDraft(draft);
    socket.request.session.save();
    socket.broadcast.to('draftList').emit('draftList', Draft.GET_LIST());
  });

  socket.on('join', data => {
    let draft = Draft.GET(data.draftId);
    player.joinDraft(draft);
    socket.request.session.save();
  });

  socket.on('leave', data => {
    let draft = Draft.GET(data.draftId);
    player.leaveDraft(draft);
    socket.request.session.save();
  });

  socket.on('start', data => {
    let draft = Draft.GET(data.draftId);
    draft.start();
    socket.broadcast.to('draftList').emit('draftList', Draft.GET_LIST());
  });

  socket.on('pickCard', data => {
    let draft = Draft.GET(data.draftId);
    player.pickCard(draft, data.cardId);
  });

  socket.on('disconnect', () => {
    player.onDisconnect();
    socket.request.session.save();
  });

  player.on('start', data => socket.emit('start', data));
  player.on('nextPack', data => socket.emit('nextPack', data));
  player.on('end', data => {
    socket.emit('end', data);
    socket.emit('history', player.getHistory());
  });
  player.on('table', data => socket.emit('table', data));
  player.on('rc', data => socket.emit('rc', data));
});

class Player extends EventEmitter {
  constructor(name) {
    super();
    this.drafts = {};
    this.name = name;
  }

  joinDraft(draft) {
    if (this.drafts[draft.id]) {
      return;
    }

    let playerId = draft.join(this);
    this.drafts[draft.id] = playerId;
  }

  leaveDraft(draft) {
    if (!this.drafts[draft.id]) {
      return;
    }

    if (!draft.started) {
      let playerId = this.drafts[draft.id];
      delete this.drafts[draft.id];
      draft.leave(draft.getPlayer(playerId));
    }
  }

  pickCard(draft, cardId) {
    let playerId = this.drafts[draft.id];
    draft.pickCard(draft.getPlayer(playerId), cardId);
  }

  getHistory() {
    return Object.keys(this.drafts)
      .map(draftId => Draft.GET(draftId))
      .filter(draft => draft.ended)
      .map(draft => ({id: draft.id, name: draft.name}));
  }

  onReconnect() {
    Object.keys(this.drafts).forEach(draftId => {
      let draft = Draft.GET(draftId);
      if (draft.started && !draft.ended) {
        this.rc(draft);
      }
    });
  }

  rc(draft) {
    let playerId = this.drafts[draft.id];
    let draftPlayer = draft.getPlayer(playerId);
    draft.rc(draftPlayer, this);
  }

  onDisconnect() {
    Object.keys(this.drafts).forEach(draftId => {
      let draft = Draft.GET(draftId);
      let playerId = this.drafts[draftId];
      if (!draft.started && !draft.ended) {
        draft.leave(draft.getPlayer(playerId));
        delete this.drafts[draftId];
      } else {
        draft.dc(draft.getPlayer(playerId));
      }
    });
  }
}

class Draft {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.roundNum = 0;
    this.passLeft = true;
    this.players = [];
    this.started = false;
  }

  static GET(id) {
    return Draft.DRAFTS[id];
  }

  static GET_LIST() {
    return Draft.DRAFTS
      .filter(draft => !draft.started && !draft.ended)
      .map(draft => ({id: draft.id, name: draft.name}));
  }

  static ADD(...args) {
    let id = Draft.DRAFTS.length;
    let draft = new Draft(id, ...args);
    Draft.DRAFTS.push(draft);
    return draft;
  }

  getPlayer(playerId) {
    return this.players[playerId];
  }

  join(player) {
    let draftPlayer = {events: player, name: player.name, nextPack: true, cards: []};
    this.players.push(draftPlayer);
    this.updateTable();
    return this.players.length - 1;
  }

  leave(player) {
    if (!this.started) {
      this.players = this.players.filter(p => player != p);
      this.updateTable();
      if (this.players.length == 0) {
        delete Draft.DRAFTS[this.id];
      }
    }
  }

  start() {
    this.started = true;
    this.players.forEach(player => {
      player.events.emit('start', {draftId: this.id});
      this.getNextPack(player);
    });
    this.updateTable();
  }

  getNextPack(player) {
    if (this.players.every(player => player.nextPack && !player.dc)) {
      let newPack = !this.players[0].pack;
      if (newPack) {
        this.roundNum++;
        if (this.roundNum > 3) {
          return this.end();
        }

        this.passLeft = !this.passLeft;
        this.players.forEach(player => player.pack = createPack());
      } else {
        let packs = this.players.map(player => player.pack);
        if (this.passLeft) {
          packs.push(packs.shift());
        } else {
          packs.unshift(packs.pop());
        }
        this.players.forEach((player, index) => player.pack = packs[index]);
      }

      this.players.forEach(player => {
        player.nextPack = false;
        player.events.emit('nextPack', {
          draftId: this.id,
          pack: player.pack,
          roundNum: this.roundNum
        });
      });
    }
    this.updateTable();
  }

  pickCard(player, cardId) {
    if (player.nextPack) {
      return;
    }

    let card = player.pack.splice(cardId, 1)[0];
    player.cards.push(card);
    if (player.pack.length == 0) {
      player.pack = null;
    }
    player.nextPack = true;
    this.getNextPack(player);
  }

  dc(player) {
    player.dc = true;
    this.updateTable();
  }

  rc(player, events) {
    player.events = events;
    player.dc = false;
    player.events.emit('rc', {
      draftId: this.id,
      started: this.started,
      ended: this.ended,
      pack: player.pack,
      cardPicked: player.nextPack,
      cards: player.cards
    });

    this.getNextPack();
    this.updateTable();
  }

  end() {
    this.players.forEach(player => player.events.emit('end', {draftId: this.id}));
    this.started = false;
    this.ended = true;
    this.updateTable();
  }

  updateTable() {
    let table = this.players.map(player => {
      let tablePlayer = {name: player.name, dc: player.dc, cardPicked: player.nextPack};
      if (this.ended) {
        tablePlayer.cards = player.cards;
      }
      return tablePlayer;
    });
    this.players.forEach(player => player.events.emit('table', {draftId: this.id, table}));
  }
}

Draft.DRAFTS = [];

function createPack() {
  return new Pack().cards.map(card => card.name);
}

