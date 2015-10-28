import React from 'react';

export default class CardsList extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  getCounts(cards) {
    return cards.reduce((cards, card) => {
      cards[card.name] = cards[card.name] || 0;
      cards[card.name]++;
      return cards;
    }, {});
  }

  getCardsList() {
    if (this.props.counts) {
      let cardCounts = this.getCounts(this.props.cards);
      let sideCounts = this.getCounts(this.props.sideboard);

      let cards = Object.keys(cardCounts).map(name => `${cardCounts[name]} ${name}`);
      let side = Object.keys(sideCounts).map(name => `SB: ${sideCounts[name]} ${name}`);

      return cards.concat(side);
    } else {
      let cards = this.props.cards.map(card => card.name);
      let sideCards = this.props.sideCards.map(card => card.name);
      return cards.concat(sideCards);
    }
  }

  onChange(event) {
    this.props.onChange(event.target.value.split('\n'));
  }

  render() {
    let cardsList = this.getCardsList().join('\n');

    if (this.props.onChange) {
      return (<textarea className='cards-list' value={cardsList} onChange={this.onChange} />);
    } else {
      return (<textarea className='cards-list' value={cardsList} readOnly />)
    }
  }
}

CardsList.defaultProps = {counts: true, sideCards: []};

