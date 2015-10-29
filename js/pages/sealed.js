import React from 'react';

import CardsList from '../components/cardsList';
import Board from '../components/board';
import Pack from '../models/pack';

export default class Sealed extends React.Component {
  constructor() {
    super();
    this.toSideboard = this.toSideboard.bind(this);
    this.toMainboard = this.toMainboard.bind(this);

    this.state = {cards: [], sideCards: []};

    let packs = [1, 2, 3, 4, 5, 6].map(() => new Pack());
    packs.forEach((pack, index) => {
      pack.cards.forEach(card => {
        card.pack = `Pack ${index + 1}`;
        this.state.sideCards.push(card);
      });
    });
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
    return (
      <div className='sealed'>
        <h1 className='header'>Sealed Generator</h1>
        <CardsList cards={this.state.cards} sideboard={this.state.sideCards} />
        <Board name='Main Board' cards={this.state.cards} onCardClick={this.toSideboard} defaultRows={true} />
        <Board name='Side Board' cards={this.state.sideCards} onCardClick={this.toMainboard} defaultSort='pack' />
      </div>
    );
  }
}

