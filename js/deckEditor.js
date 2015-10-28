import 'babel/register';

import React from 'react';
import ReactDOM from 'react-dom';

import CardsList from './components/cardsList';
import Board from './components/board';
import * as Cards from './models/cards';

class Sealed extends React.Component {
  constructor() {
    super();
    this.update = this.update.bind(this);
    this.toSideboard = this.toSideboard.bind(this);
    this.toMainboard = this.toMainboard.bind(this);
    this.addCard = this.addCard.bind(this);

    this.state = {cards: [], sideCards: [], allCards: Cards.getAll()};
  }

  update(cardsList) {
    let cards = cardsList
      .filter(card => card.indexOf('SB: ') != 0)
      .reduce(parseCount, []);

    let sideCards = cardsList
      .filter(card => card.indexOf('SB: ') == 0)
      .map(card => card.substr(4))
      .reduce(parseCount, []);

    this.setState({
      cards: Cards.fromNames(cards),
      sideCards: Cards.fromNames(sideCards)
    });

    function parseCount(cards, card) {
      let parts = card.trim().split(/\s+/);
      let count = parseInt(parts.shift(), 10);
      let name = parts.join(' ');
      for (let i = 0; i < count; i++) {
        cards.push(name);
      }
      return cards;
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

  addCard(card) {
    this.state.cards.push(card);
    this.setState(this.state);
  }

  render() {
    return (
      <div className='deck-editor'>
        <h1 className='header'>Deck Editor</h1>
        <CardsList cards={this.state.cards} sideboard={this.state.sideCards} onChange={this.update} />
        <Board name='Main Board' cards={this.state.cards} onCardClick={this.toSideboard} defaultRows={true} />
        <Board name='Side Board' cards={this.state.sideCards} onCardClick={this.toMainboard} defaultSort='pack' />
        <Board name='All Cards' cards={this.state.allCards} onCardClick={this.addCard} defaultSort='colour' />
      </div>
    );
  }
}

ReactDOM.render(<Sealed />, document.getElementById('root'));

