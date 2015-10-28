import 'babel/register';

import React from 'react';
import ReactDOM from 'react-dom';

import CardsList from './components/cardsList';
import Board from './components/board';
import * as Cards from './models/cards';

class AllCards extends React.Component {
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

ReactDOM.render(<AllCards />, document.getElementById('root'));

