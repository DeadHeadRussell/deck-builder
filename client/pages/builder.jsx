import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import copy from 'copy-to-clipboard';
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
      exportAnchor: null,
      allCards: List(),
      mainboard: List()
    };
  }

  openExportMenu = event => {
    this.setState({exportAnchor: event.target});
  }

  doExport = type => {
    const action = {
      clipboard: cardsText => copy(cardsText),
      eternalDeckAnalyser: cardsText =>
        window.open(`https://noahsug.github.io/eternal-deck-analyzer/?${window.encodeURIComponent(cardsText)}`)
    }[type];
    return () => {
      action(this.cardsList.getText());
      this.closeExportMenu();
    }
  }

  closeExportMenu = () => {
    this.setState({exportAnchor: null});
  }

  updateCards = cards => {
    this.setState({mainboard: cards
      .sort((a, b) => a.compare(b))
    });
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
        .sort((a, b) => a.compare(b))
    });
  }

  removeCard = card => {
    const {mainboard} = this.state;
    this.setState({
      mainboard: mainboard.remove(mainboard.findIndex(c => c == card))
    });
  }

  render() {
    const {exportAnchor, allCards, mainboard} = this.state;

    return (
      <div>
        <Typography variant='headline'>Deck Editor</Typography>

        <CardsList
          innerRef={cardsList => this.cardsList = cardsList}
          allCards={allCards}
          cards={mainboard}
          onChange={this.updateCards}
        />
        <Button
          aria-owns={exportAnchor ? 'export-menu' : null}
          aria-haspopup='true'
          onClick={this.openExportMenu}
        >
          Export...
        </Button>
        <Menu
          id='export-menu'
          anchorEl={exportAnchor}
          open={!!exportAnchor}
          onClose={this.closeExportMenu}
        >
          <MenuItem onClick={this.doExport('clipboard')}>Clipboard</MenuItem>
          <MenuItem onClick={this.doExport('eternalDeckAnalyser')}>Eternal Deck Analyser</MenuItem>
        </Menu>

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

