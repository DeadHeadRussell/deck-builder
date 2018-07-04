import {Map} from 'immutable';

const KEY_NAME = 'decks';

function getDecks() {
  return Map(JSON.parse(window.localStorage.getItem(KEY_NAME)));
}

function saveDecks(decks) {
  window.localStorage.setItem(KEY_NAME, JSON.stringify(decks.toObject()));
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
  const decks = getDecks().remove(deckName);
  saveDecks(decks);
}

export const Decks = {
  getDecksList,
  getDeck,
  setDeck,
  removeDeck
};

