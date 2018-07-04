import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import copy from 'copy-to-clipboard';
import debounce from 'debounce';
import {List, Map} from 'immutable';

import {ETERNAL_CARDS, ETERNAL_GROUPS, ETERNAL_DEFAULT_SORT_ORDER} from '~/../shared/models/eternalCards';
import {Decks} from '~/libs/persistence';

import Board from '~/components/board';
import CardsList from '~/components/cardsList';

export default class Builder extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.createInitialState(props);
  }

  componentDidMount() {
    ETERNAL_CARDS.then(cards => {
      const {deckName} = this.state;
      const deck = Decks.getDeck(deckName);

      const allCards = cards;
      const cardsPool = List(deck && deck.cardsPool)
        .map(cardName => cards.find(card => card.name == cardName));

      const mainboard = List(deck && deck.cards)
        .map(cardName => cards.find(card => card.name == cardName))

      this.setState({
        loading: false,
        deckName,
        allCards,
        cardsPool,
        mainboard
      });
    });
  }

  createInitialState(props) {
    const deckName = props.match.params.name || '';

    return {
      exportAnchor: null,
      loading: true,
      deckName
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

  saveDeck = debounce(() => {
    const {deckName, allCards, cardsPool, mainboard} = this.state;
    Decks.setDeck(deckName, {
      name: deckName,
      cards: mainboard
        .map(card => card.name)
        .toArray(),
      cardsPool: cardsPool
        .map(card => card.name)
        .toArray()
    });
  }, 500);

  onDeckNameChange = event => {
    this.setState({deckName: event.target.value});
  }

  updateDeckName = event => {
    const {deckName} = this.state;

    this.setState({deckNameError: null});

    const newDeckName = event.target.value;
    if (newDeckName == deckName) {
      return;
    }

    const deckCollision = Decks.getDeck(newDeckName);
    if (deckCollision) {
      this.setState({deckNameError: `You already have a deck named "${newDeckName}"`});
    } else {
      Decks.removeDeck(deckName);
      this.setState({deckName: newDeckName}, this.saveDeck);
    }
  }

  updateCardsPool = cardsPool => {
    this.setState({cardsPool: cardsPool
      .sort((a, b) => a.compare(b))
    });
  }

  updateMainboardCards = cards => {
    this.setState({mainboard: cards
      .sort((a, b) => a.compare(b))
    }, this.saveDeck);
  }

  handleCardAction = (action, card) => {
    switch (action) {
      case 'Add Card': return this.addCard(card);
      case 'Remove Card': return this.removeCard(card);
      case 'Add to Deck': return this.addCard(card);
    }
  }

  addCard = card => {
    const {cardsPool, mainboard} = this.state;
    this.setState({
      mainboard: mainboard.push(card)
        .sort((a, b) => a.compare(b)),
      cardsPool: cardsPool.remove(cardsPool.findIndex(c => c == card))
    }, this.saveDeck);
  }

  removeCard = card => {
    const {cardsPool, mainboard} = this.state;
    this.setState({
      mainboard: mainboard.remove(mainboard.findIndex(c => c == card)),
      cardsPool: cardsPool.isEmpty()
        ? cardsPool
        : cardsPool.push(card)
          .sort((a, b) => a.compare(b))
    }, this.saveDeck);
  }

  render() {
    const {exportAnchor, deckName, deckNameError, loading, allCards, cardsPool, mainboard} = this.state;

    return loading
      ? (
        <React.Fragment>
          <Typography variant='subtitle'>{deckName}</Typography>
          <CircularProgress />
        </React.Fragment>
      )
      : (
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography variant='headline'>Deck Editor</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label='Deck Name'
              defaultValue={deckName}
              onBlur={this.updateDeckName}
              error={!!deckNameError}
              helperText={deckNameError}
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
          </Grid>

          <Grid item>
            <CardsList
              label='Card Pool'
              allCards={allCards}
              cards={cardsPool}
              onChange={this.updateCardsPool}
            />
          </Grid>
          <Grid item>
            <CardsList
              label='Deck List'
              innerRef={cardsList => this.cardsList = cardsList}
              allCards={allCards}
              cards={mainboard}
              onChange={this.updateMainboardCards}
            />
          </Grid>

          <Grid item xs={12}>
            <Board
              name='Mainboard'
              cards={mainboard}
              defaultGrouping='Type'
              groupings={ETERNAL_GROUPS}
              sortOrder={ETERNAL_DEFAULT_SORT_ORDER}
              cardActions={['Remove Card', 'Add Card']}
              onCardClick={this.handleCardAction}
            />
          </Grid>
          <Grid item xs={12}>
            <Board
              name='All Cards'
              cards={cardsPool.isEmpty() ? allCards : cardsPool}
              groupings={ETERNAL_GROUPS}
              sortOrder={ETERNAL_DEFAULT_SORT_ORDER}
              cardActions={['Add to Deck']}
              onCardClick={this.handleCardAction}
            />
          </Grid>
        </Grid>
      );
  }
}

