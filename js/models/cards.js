import cardData from '../data/cards';
import Card from './card';

export const CARDS = cardData;
export const COLOURS = ['U', 'B', 'R', 'G', 'W', 'N', 'E'];
export const RARITIES = ['mythic', 'rare', 'uncommon', 'common'];
export const TYPES = ['Planeswalker', 'Creature', 'Artifact', 'Enchantment', 'Sorcery', 'Instant', 'Land'];
export const SUB_TYPES = ['Sith', 'Bounty Hunters', 'Wild Beasts', 'Jedi', 'Trade Federation', 'Troopers', 'Starships', 'Other'];

export function getAll() {
  return CARDS.map(card => new Card(card));
}

export function fromNames(names) {
  return names
    .filter(name => name.trim().length > 0)
    .map(name => new Card(CARDS.find(card => card.name == name.trim())));
}

export function sort(cards, columns) {
  columns = Array.isArray(columns) ? columns : [columns];
  return cards.sort((a, b) => a.compare(b, columns));
}

export function group(cards, column) {
  let groups = cards.reduce((groups, card) => {
    let group = card[column];
    if (!group && column == 'pack') {
      group = 'All';
    }

    groups[group] = groups[group] || [];
    groups[group].push(card);
    return groups;
  }, {});

  return Object.keys(groups)
    .sort((a, b) => Card.compareValues(a, b, column))
    .map(group => {
      groups[group].name = group;
      return groups[group];
    });
}

export function getRare() {
  if (Math.random() < 1 / 8) {
    return sample(byRarity.mythic, 1);
  } else {
    return sample(byRarity.rare, 1);
  }
}

export function getUncommons() {
  return sample(byRarity.uncommon, 3);
}

export function getCommons() {
  return sample(byRarity.common, 10);
}

let byRarity = CARDS.reduce((obj, card) => {
  obj[card.rarity] = obj[card.rarity] || [];
  obj[card.rarity].push(card);
  return obj;
}, {});

function sample(array, num) {
  let cards = [];
  let indices = [];
  for (let i = 0; i < num; i++) {
    let index;
    do {
      index = Math.floor(Math.random() * array.length);
    } while (indices.includes(index));
    indices.push(index);
    cards.push(new Card(array[index]));
  }
  return cards;
}

