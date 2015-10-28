import React from 'react';

import Card from './card';

export default class CardGroup extends React.Component {
  constructor() {
    super();
    this.toggleHide = this.toggleHide.bind(this);

    this.state = {hide: false};
  }

  toggleHide() {
    this.setState({hide: !this.state.hide});
  }

  render() {
    let classes = 'card-group ' + (this.state.hide ? 'hide' : '');
    let cardElems = this.props.cards.map((card, i) => {
      return <Card key={i} card={card} onClick={this.props.onCardClick} />;
    });

    return (
      <div className={classes}>
        <h2 className='card-group-name'>{`${this.props.name} - (${this.props.cards.length})`}</h2>
        <button onClick={this.toggleHide}>Show / Hide</button>
        <div className='cards'>{cardElems}</div>
      </div>
    );
  }
}

