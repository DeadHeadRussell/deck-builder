import {Map} from 'immutable';

const KEY_NAME = 'decks';
const UNDO_KEY_NAME = 'removed_deck';

function getDecks() {
  return Map(JSON.parse(window.localStorage.getItem(KEY_NAME)));
}

function saveDecks(decks) {
  window.localStorage.setItem(KEY_NAME, JSON.stringify(decks.toObject()));
}

function getUndoDeck() {
  return JSON.parse(window.localStorage.getItem(UNDO_KEY_NAME));
}

function saveDeckUndo(deck) {
  window.localStorage.setItem(UNDO_KEY_NAME, JSON.stringify(deck));
}

function removeUndoDeck() {
  window.localStorage.removeItem(UNDO_KEY_NAME);
}

export function getDecksList() {
  return getDecks().toList();
}

export function getDeck(deckName) {
  return getDecks().get(deckName);
}

export function setDeck(deckName, deck) {
  const decks = getDecks().set(deckName, deck);
  saveDecks(decks);
}

export function removeDeck(deckName) {
  const decks = getDecks();
  const oldDeck = decks.get(deckName);
  saveDeckUndo(oldDeck);
  saveDecks(decks.remove(deckName));
}

export function undoRemoveDeck() {
  const deck = getUndoDeck();
  if (deck) {
    setDeck(deck.name, deck);
    removeUndoDeck();
  }
}

export const Decks = {
  getDecksList,
  getDeck,
  setDeck,
  removeDeck,
  undoRemoveDeck
};

