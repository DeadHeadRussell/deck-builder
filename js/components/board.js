import React from 'react';

import CardGroup from './cardGroup';
import * as Cards from '../models/cards';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.toggleRows = this.toggleRows.bind(this);
    this.toggleCompact = this.toggleCompact.bind(this);

    let grouping = props.defaultSort || 'colour';
    let rows = props.defaultRows || false;
    this.state = {grouping, sorts: this.getSorts(grouping), rows, compact: false};
  }

  getSorts(grouping) {
    switch (grouping) {
      case 'pack': return ['name', 'cmc', 'type', 'colour', 'rarity'];
      case 'colour': return ['name', 'rarity', 'cmc', 'type'];
      case 'type': return ['name', 'rarity', 'colour', 'cmc'];
      case 'subtype': return ['name', 'rarity', 'colour', 'cmc'];
      case 'rarity': return ['name', 'cmc', 'colour', 'type'];
      case 'cmc': return ['name', 'rarity', 'colour', 'type'];
    }
  }

  getCardGroups() {
    let groups = Cards.group(this.props.cards, this.state.grouping);
    groups.forEach(group => Cards.sort(group, this.state.sorts));
    return groups;
  }

  sort(grouping) {
    this.setState({grouping, sorts: this.getSorts(grouping)});
  }

  toggleRows() {
    this.setState({rows: !this.state.rows});
  }

  toggleCompact() {
    this.setState({compact: !this.state.compact});
  }

  render() {
    let cardGroupElems = this.getCardGroups().map(group => {
      return <CardGroup key={group.name} name={group.name} cards={group} onCardClick={this.props.onCardClick} />;
    });

    let cardsClasses = 'board-cards';
    if (this.state.compact) {
      cardsClasses += ' compact rows';
    } else if (this.state.rows) {
      cardsClasses += ' rows';
    } else {
      cardsClasses += ' columns';
    }

    return (
      <div className='board'>
        <h2 className='board-header'>{this.props.name} - ({this.props.cards.length})</h2>
        <div className='board-controls'>
          <h3 className='board-subheader'>Sort...</h3>
          <button className='board-control' onClick={this.sort.bind(this, 'pack')}>Packs</button>
          <button className='board-control' onClick={this.sort.bind(this, 'colour')}>Colour</button>
          <button className='board-control' onClick={this.sort.bind(this, 'type')}>Type</button>
          <button className='board-control' onClick={this.sort.bind(this, 'subtype')}>SubType</button>
          <button className='board-control' onClick={this.sort.bind(this, 'cmc')}>CMC</button>
          <button className='board-control' onClick={this.sort.bind(this, 'rarity')}>Rarity</button>
          <h3 className='board-subheader'>View...</h3>
          <button className='board-control' onClick={this.toggleRows}>Rows / Columns</button>
          <button className='board-control' onClick={this.toggleCompact}>Compact / Spacious</button>
        </div>
        {cardGroupElems.length > 0 ? '' : <p className='board-message'>This board is empty</p>}
        <div className={cardsClasses}>{cardGroupElems}</div>
      </div>
    );
  }
}

