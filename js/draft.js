import 'babel/register';

import React from 'react';
import ReactDOM from 'react-dom';

import CardsList from './components/cardsList';
import Board from './components/board';
import Pack from './models/pack';

class Draft extends React.Component {
  constructor() {
    super();
    this.updateNumDrafters = this.updateNumDrafters.bind(this);
    this.newPack = this.newPack.bind(this);
    this.updatePack = this.updatePack.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.toSideboard = this.toSideboard.bind(this);
    this.toMainboard = this.toMainboard.bind(this);

    this.roundNum = 1;
    this.packNum = -1;

    this.state = {
      numDrafters: 2,
      selected: false,
      pack: null,
      cards: [],
      sideCards: []
    };

    this.state.pack = this.createPack(new Pack());
  }

  createPack(pack) {

    this.packNum = (this.packNum + 1) % this.state.numDrafters;
    let packNum = this.packNum + ((this.roundNum - 1) * this.state.numDrafters) + 1;

    pack.cards.forEach(card => card.pack = packNum);
    return pack;
  }

  updateNumDrafters(event) {
    let num = parseInt(event.target.value, 10);
    if (!num > 0) {
      num = null;
    }
    this.setState({numDrafters: num});
  }

  newPack() {
    this.roundNum++;
    this.packNum = -1;
    this.setState({pack: this.createPack(new Pack()), selected: false});
  }

  updatePack(cardNames) {
    let pack = Pack.FROM_NAMES(cardNames);
    if (pack.cards.length > 0) {
      this.setState({pack: this.createPack(pack), selected: false});
    } else {
      this.setState({pack: null, selected: false});
    }
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
    let messageText = this.state.selected ?
      'You have selected a card from this pack' :
      'Please select a card from this pack';
    
    let packCards = this.state.pack ? this.state.pack.cards : [];

    return (
      <div className='draft'>
        <h1 className='header'>Draft</h1>

        <div className='draft-controls'>
          <h2 className='subheader'>Card Selection</h2>
          <label className='draft-control'>
            <p>Number of drafters:</p>
            <input className='draft-num-drafters' value={this.state.numDrafters} onChange={this.updateNumDrafters} />
          </label>
          <button className='draft-control' onClick={this.newPack}>Generate Pack</button>
          <div className='draft-control'><CardsList cards={packCards} counts={false} onChange={this.updatePack} /></div>
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
}

ReactDOM.render(<Draft />, document.getElementById('root'));

