import React from 'react';

import * as Cards from '../models/cards';
import CardsList from '../components/cardsList';
import Board from '../components/board';
import Pack from '../models/pack';
import Table from '../components/table';

let socket = io('http://mtg.ajrussell.ca/draft');

export default class Draft extends React.Component {
  constructor() {
    super();
    this.createDraft = this.createDraft.bind(this);
    this.startDraft = this.startDraft.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.toSideboard = this.toSideboard.bind(this);
    this.toMainboard = this.toMainboard.bind(this);

    this.draftId = 0;

    this.roundNum = 1;
    this.packNum = -1;

    this.state = {
      draftList: [],
      history: [],
      ended: false,
      inDraft: false,
      selected: false,
      started: false,
      pack: null,
      cards: [],
      sideCards: [],
      table: []
    };

    socket.on('draftList', data => this.setState({draftList: data}));
    socket.on('history', data => this.setState({history: data}));

    socket.on('start', data => {
      this.draftId = data.draftId;
      this.setState({started: true});
    });

    socket.on('nextPack', data => {
      let pack = Pack.FROM_NAMES(data.pack);
      this.roundNum = data.roundNum;
      this.setState({pack: this.createPack(pack), selected: false});
    });

    socket.on('end', data => this.setState({ended: true, started: false}));
    socket.on('table', data => {
      this.draftId = data.draftId;
      this.setState({table: data.table});
    });

    socket.on('rc', data => {
      this.draftId = data.draftId;
      this.setState({
        inDraft: true,
        started: data.started,
        ended: data.ended,
        pack: data.pack ? this.createPack(Pack.FROM_NAMES(data.pack)) : null,
        selected: data.cardPicked,
        sideCards: Cards.fromNames(data.cards)
      });
    });
  }

  createDraft() {
    let name = prompt('Draft name');
    if (name) {
      socket.emit('create', {name});
      this.setState({inDraft: true});
    }
  }

  joinDraft(draft) {
    socket.emit('join', {draftId: draft.id});
    this.setState({inDraft: true});
  }

  rejoinDraft(draft) {
    socket.emit('rc', {draftId: draft.id});
    this.setState({inDraft: true});
  }

  createPack(pack) {
    let numDrafters = this.state.table.length;
    this.packNum = (this.packNum + 1) % numDrafters;

    let packNum = this.packNum + ((this.roundNum - 1) * numDrafters) + 1;
    pack.cards.forEach(card => card.pack = packNum);
    return pack;
  }

  startDraft() {
    socket.emit('start', {draftId: this.draftId});
  }

  selectCard(card) {
    if (this.state.selected) {
      return;
    }

    let index = this.state.pack.cards.indexOf(card);
    if (index >= 0 && confirm(`Are you sure you want to pick ${card.name}`)) {
      this.state.pack.cards.splice(index, 1);
      this.state.sideCards.push(card);
      this.state.selected = true;
      this.setState(this.state);
      socket.emit('pickCard', {draftId: this.draftId, cardId: index});
    }
  }

  toSideboard(card) {
    let index = this.state.cards.indexOf(card);
    if (index >= 0) {
      this.state.cards.splice(index, 1);
      this.state.sideCards.push(card);
      this.setState(this.state);
    }
  }

  toMainboard(card) {
    let index = this.state.sideCards.indexOf(card);
    if (index >= 0) {
      this.state.sideCards.splice(index, 1);
      this.state.cards.push(card);
      this.setState(this.state);
    }
  }

  render() {
    if (!this.state.inDraft) {
      return this.renderDraftList();
    } else if (this.state.started) {
      return this.renderDraft();
    } else if (this.state.ended) {
      return this.renderBoards();
    } else {
      return this.renderIdle();
    }
  }

  renderDraftList() {
    return (
      <div className='draft'>
        <h1 className='header'>Drafts</h1>
        <div className='draft-controls'>
          <h2 className='subheader'>Draft List</h2>
          <button className='draft-control' onClick={this.createDraft}>Create Draft</button>
          <ul className='draft-list'>{this.state.draftList.map(draft => (
            <li key={draft.id} className='draft-list-item'>
              <button className='draft-control' onClick={this.joinDraft.bind(this, draft)}>
                {draft.name}
              </button>
            </li>
          ))}</ul>
        </div>

        <div className='draft-controls'>
          <h2 className='subheader'>History</h2>
          <ul className='draft-list'>{this.state.history.map(draft => (
            <li key={draft.id} className='draft-list-item'>
              <button className='draft-control' onClick={this.rejoinDraft.bind(this, draft)}>
                {draft.name}
              </button>
            </li>
          ))}</ul>
        </div>
      </div>
    );
  }

  renderDraft() {
    let messageText = this.state.selected ?
      'You have selected a card from this pack' :
      'Please select a card from this pack';
    
    let packCards = this.state.pack ? this.state.pack.cards : [];

    return (
      <div className='draft'>
        <h1 className='header'>Draft</h1>

        <div className='draft-controls'>
          <h2 className='subheader'>Players</h2>
          <Table players={this.state.table} />
        </div>

        <div className='draft-controls'>
          <h2 className='subheader'>Card Selection</h2>
          <p className='draft-control'>{messageText}</p>
          <Board name='Draft Pack' cards={packCards} onCardClick={this.selectCard} defaultSort='pack' />
        </div>

        <div className='draft-controls'>
          <h2 className='subheader'>Your Cards</h2>
          <div className='draft-control'><CardsList cards={this.state.cards} sideboard={this.state.sideCards} /></div>
          <Board name='Main Board' cards={this.state.cards} onCardClick={this.toSideboard} defaultRows={true} />
          <Board name='Side Board' cards={this.state.sideCards} onCardClick={this.toMainboard} defaultSort='pack' />
        </div>
      </div>
    );
  }

  renderBoards() {
    return (
      <div className='draft'>
        <h1 className='header'>Draft</h1>

        <p className='draft-control'>Draft completed</p>

        <div className='draft-controls'>
          <h2 className='subheader'>Your Cards</h2>
          <div className='draft-control'><CardsList cards={this.state.cards} sideboard={this.state.sideCards} /></div>
          <Board name='Main Board' cards={this.state.cards} onCardClick={this.toSideboard} defaultRows={true} />
          <Board name='Side Board' cards={this.state.sideCards} onCardClick={this.toMainboard} defaultSort='pack' />
        </div>

        <div className='draft-controls'>
          <h2 className='subheader'>Players</h2>
          <Table players={this.state.table} />
        </div>
      </div>
    );
  }

  renderIdle() {
    return (
      <div className='draft'>
        <h1 className='header'>Draft</h1>
        <div className='draft-controls'>
          <h2 className='subheader'>Players</h2>
          <Table players={this.state.table} />
        </div>

        <div className='draft-controls'>
          <button className='draft-control' onClick={this.startDraft}>Start Draft</button>
        </div>
      </div>
    );
  }
}

