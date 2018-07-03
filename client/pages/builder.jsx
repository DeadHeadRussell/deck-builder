import Typography from '@material-ui/core/Typography';
import {List} from 'immutable';

import {ETERNAL_CARDS, ETERNAL_GROUPS, ETERNAL_DEFAULT_SORT_ORDER} from '~/../shared/models/eternalCards';

import Board from '~/components/board';

export default class Builder extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.createInitialState(props);
  }

  createInitialState(props) {
    return {
      mainboard: List()
    };
  }

  handleCardAction = (action, card) => {
    switch (action) {
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
    const {mainboard} = this.state;

    return (
      <div>
        <Typography variant='headline'>Deck Editor</Typography>
        <Board
          name='Mainboard'
          cards={mainboard}
          groupings={ETERNAL_GROUPS}
          sortOrder={ETERNAL_DEFAULT_SORT_ORDER}
          cardActions={['Remove Card']}
          onCardClick={this.handleCardAction}
        />
        <Board
          name='All Cards'
          cards={ETERNAL_CARDS}
          groupings={ETERNAL_GROUPS}
          sortOrder={ETERNAL_DEFAULT_SORT_ORDER}
          cardActions={['Add to Deck']}
          onCardClick={this.handleCardAction}
        />
      </div>
    );
  }
}

