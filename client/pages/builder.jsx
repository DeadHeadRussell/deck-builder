import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {List} from 'immutable';

import {ETERNAL_CARDS, ETERNAL_GROUPS, ETERNAL_DEFAULT_SORT_ORDER} from '~/../shared/models/eternalCards';

import Board from '~/components/board';
import CardsList from '~/components/cardsList';

export default class Builder extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.createInitialState(props);
  }

  componentDidMount() {
    ETERNAL_CARDS.then(cards => this.setState({allCards: cards}));
  }

  createInitialState(props) {
    return {
      allCards: List(),
      mainboard: List()
    };
  }

  updateCards = cards => {
    this.setState({mainboard: cards});
  }

  handleCardAction = (action, card) => {
    switch (action) {
      case 'Add Card': return this.addCard(card);
      case 'Remove Card': return this.removeCard(card);
      case 'Add to Deck': return this.addCard(card);
    }
  }

  addCard = card => {
    const {mainboard} = this.state;
    this.setState({
      mainboard: mainboard.push(card)
    });
  }

  removeCard = card => {
    const {mainboard} = this.state;
    this.setState({
      mainboard: mainboard.remove(mainboard.findIndex(c => c == card))
    });
  }

  render() {
    const {allCards, mainboard} = this.state;

    return (
      <div>
        <Typography variant='headline'>Deck Editor</Typography>
        <CardsList allCards={allCards} cards={mainboard} onChange={this.updateCards} />
        <Board
          name='Mainboard'
          cards={mainboard}
          defaultGrouping='Type'
          groupings={ETERNAL_GROUPS}
          sortOrder={ETERNAL_DEFAULT_SORT_ORDER}
          cardActions={['Remove Card', 'Add Card']}
          onCardClick={this.handleCardAction}
        />
        <Board
          name='All Cards'
          cards={allCards}
          groupings={ETERNAL_GROUPS}
          sortOrder={ETERNAL_DEFAULT_SORT_ORDER}
          cardActions={['Add to Deck']}
          onCardClick={this.handleCardAction}
        />
      </div>
    );
  }
}

