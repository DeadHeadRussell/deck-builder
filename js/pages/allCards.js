import React from 'react';

import CardsList from '../components/cardsList';
import Board from '../components/board';
import * as Cards from '../models/cards';

export default class AllCards extends React.Component {
  constructor() {
    super();
    this.state = {cards: Cards.getAll()};
  }

  render() {
    return (
      <div className='all-cards'>
        <Board name='All Cards' cards={this.state.cards} />
      </div>
    );
  }
}

