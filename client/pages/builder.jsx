import {withTheme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import copy from 'copy-to-clipboard';
import debounce from 'debounce';
import {List, Map} from 'immutable';
import {Bar} from 'react-chartjs-2';

import {ETERNAL_CARDS, ETERNAL_GROUPS, ETERNAL_DEFAULT_SORT_ORDER, generateEternalStats} from '~/../shared/models/eternalCards';

import Board from '~/components/board';
import CardsList from '~/components/cardsList';
import {withStore} from '~/libs/store';
import {compose} from '~/libs/utils';

export default compose(
  withStore({
    bins: ['decks']
  }),
  withTheme()
)(class Builder extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.createInitialState(props);
  }

  componentDidMount() {
    this.loadDeck(this.props);
  }

  componentWillReceiveProps(newProps) {
    const oldName = this.props.match.params.name || '';
    const newName = newProps.match.params.name || '';
    if (oldName != newName) {
      this.setState(this.createInitialState(newProps), this.loadDeck);
    }
  }

  createInitialState(props) {
    const deckName = props.match.params.name || '';
    return {
      currentTab: 'cards',
      exportAnchor: null,
      loading: true,
      deckName
    };
  }

  loadDeck() {
    ETERNAL_CARDS.then(cards => {
      const {decks} = this.props;
      const {deckName} = this.state;
      const deck = decks.getDeck(deckName);

      const allCards = cards.filterNot(card => card.token);
      const cardsPool = List(deck && deck.cardsPool)
        .map(cardName => allCards.find(card => card.name == cardName));
      const mainboard = List(deck && deck.cards)
        .map(cardName => allCards.find(card => card.name == cardName))

      this.setState({
        loading: false,
        deckName,
        allCards,
        cardsPool,
        mainboard
      });
    });
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

  updateTab = (event, newTab) => {
    this.setState({currentTab: newTab});
  }

  asDeck() {
    const {deckName, mainboard, cardsPool} = this.state;
    return {
      name: deckName,
      cards: mainboard
        .map(card => card.name)
        .toArray(),
      cardsPool: cardsPool
        .map(card => card.name)
        .toArray()
    };
  }

  saveDeck = debounce(() => {
    const {decks} = this.props;
    const {deckName, cardsPool, mainboard} = this.state;
    decks.setDeck(this.asDeck());
  }, 500);

  onDeckNameChange = event => {
    this.setState({deckName: event.target.value});
  }

  updateDeckName = event => {
    const {decks} = this.props;
    const {deckName} = this.state;

    this.setState({deckNameError: null});

    const newDeckName = event.target.value;
    if (newDeckName == deckName) {
      return;
    }

    const deckCollision = decks.getDeck(newDeckName);
    if (deckCollision) {
      this.setState({deckNameError: `You already have a deck named "${newDeckName}"`});
    } else {
      decks.removeDeck(this.asDeck());
      this.setState({deckName: newDeckName}, this.saveDeck);
    }
  }

  updateCardsPool = cardsPool => {
    this.setState({cardsPool: cardsPool
      .sort((a, b) => a.compare(b))
    }, this.saveDeck);
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
    const {classes, theme} = this.props;
    const {currentTab, exportAnchor, deckName, deckNameError, loading, allCards, cardsPool, mainboard} = this.state;

    return loading
      ? (
        <React.Fragment>
          <Typography variant='title'>{deckName}</Typography>
          <CircularProgress />
        </React.Fragment>
      )
      : (
        <Grid container spacing={40}>
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

          <Grid item xs={12}>
            <Tabs value={currentTab} fullWidth onChange={this.updateTab}>
              <Tab value='cards' label='Cards' />
              <Tab value='lists' label='Lists' />
              <Tab value='stats' label='Stats' />
            </Tabs>
          </Grid>

          {currentTab == 'cards'
            ? (
              <React.Fragment>
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
              </React.Fragment>
            )
          : currentTab == 'lists'
            ? (
              <React.Fragment>
                <Grid item>
                  <CardsList
                    label='Card Pool'
                    helperText='Use this if you are working with a limited set of cards (eg, a draft or sealed card pool).'
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
              </React.Fragment>
            )
          : currentTab == 'stats'
            ? (
              <React.Fragment>
                {generateEternalStats(mainboard)
                  .map(stats => (
                    <Grid item xs={12} md={6}>
                      <Bar
                        data={{
                          labels: stats.labels,
                          datasets: [{
                            label: stats.title,
                            data: stats.values,
                            backgroundColor: stats.colours || theme.palette.secondary.dark
                          }]
                        }}
                        options={{
                          scales: {
                            yAxes: [{
                              ticks: {
                                beginAtZero: true
                              }
                            }]
                          }
                        }}
                      />
                    </Grid>
                  ))
                }
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
              </React.Fragment>
            )
          : null}
        </Grid>
      );
  }
});

