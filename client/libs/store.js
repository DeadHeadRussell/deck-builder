import {List, Map} from 'immutable';

const store = {};

export function addBin(name, Bin) {
  store[name] = new Bin(name);
}

export class Bin {
  constructor(name) {
    this.name = name;
    this.listeners = List();
  }

  registerListener(listener) {
    this.listeners = this.listeners.push(listener);
    return () => this.listeners.remove(this.listeners.indexOf(listener));
  }

  notify() {
    this.listeners.forEach(listener => listener(name));
  }
}

export function withStore(options) {
  return function(WrappedComponent) {
    const wrappedName = WrappedComponent.displayName ||
      WrappedComponent.name || 'Component';

    class WithStore extends React.Component {
      static displayName = `WithStore(${wrappedName})`

      componentDidMount() {
        const {bins} = options;
        this.setState({
          removeListeners: bins.map(binName => store[binName].registerListener(this.onNotify))
        });
      }

      componentWillUnmount() {
        const {removeListeners} = this.state;
        removeListeners.forEach(removeListener => removeListener());
      }

      onNotify = (binName) => {
        this.forceUpdate();
      }

      render() {
        const bins = List(options.bins)
          .toMap()
          .mapEntries(([_, binName]) => [binName, store[binName]])
          .toObject();

        return <WrappedComponent {...this.props} {...bins} />;
      }
    }

    return WithStore;
  }
}

addBin('decks', class DecksBin extends Bin {
  static KEY_NAME = 'decks'
  static UNDO_KEY_NAME = 'removed_deck'

  constructor(name) {
    super(name);
    this.decks = Map(JSON.parse(window.localStorage.getItem(DecksBin.KEY_NAME)));
    this.removedDeck = JSON.parse(window.localStorage.getItem(DecksBin.UNDO_KEY_NAME));
  }

  save(decks) {
    this.decks = decks;
    window.localStorage.setItem(DecksBin.KEY_NAME, JSON.stringify(decks.toObject()));
    this.notify();
  }

  saveRemovedDeck(deck) {
    this.removedDeck = deck;
    if (deck) {
      window.localStorage.setItem(DecksBin.UNDO_KEY_NAME, JSON.stringify(deck));
    } else {
      window.localStorage.removeItem(DecksBin.UNDO_KEY_NAME);
    }
    this.notify();
  }

  getDecksList() {
    return this.decks.toList();
  }

  getDeck(deckName) {
    return this.decks.get(deckName);
  }

  setDeck(deck) {
    this.save(this.decks.set(deck.name, deck));
  }

  removeDeck(deck) {
    this.saveRemovedDeck(deck);
    this.save(this.decks.remove(deck.name));
  }

  undoRemoveDeck() {
    if (this.removedDeck) {
      this.setDeck(this.removedDeck);
      this.saveRemovedDeck(null);
    }
  }
});

