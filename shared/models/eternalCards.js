import {List, Map, OrderedMap, Set} from 'immutable';

import rawEternalCardData from '../eternal-cards.json';
import Card from './card';

const FACTIONS_ORDER = List([
  'Fire',
  'Time',
  'Justice',
  'Primal',
  'Shadow',
  'Praxis',
  'Rakano',
  'Combrei',
  'Elysian',
  'Hooru',
  'Argenport',
  'Skycrag',
  'Feln',
  'Stonescar',
  'Xenan',
  'Multifaction',
  'Factionless'
]);

const RARITIES_ORDER = List([
  'Common',
  'Uncommon',
  'Rare',
  'Promo',
  'Legendary',
  'None'
]);

const SETS_ORDER = List([
  'Set 0',
  'The Eternal Throne',
  'Jekk\'s Bounty',
  'Omens of the Past',
  'The Tale of Horus Traver',
  'The Dusk Road',
  'Dead Reckoning',
  'The Fall of Argenport'
]);

const SETS = Map()
  .set(0, 'Set 0')
  .set(1, 'The Eternal Throne')
  .set(2, 'Omens of the Past')
  .set(3, 'The Dusk Road')
  .set(4, 'The Fall of Argenport')
  .set(1001, 'Jekk\'s Bounty')
  .set(1002, 'The Tale of Horus Traver')
  .set(1003, 'Dead Reckoning');

const FACTIONS = Map()
  .set(Set(), 'Factionless')
  .set(Set(['F']), 'Fire')
  .set(Set(['T']), 'Time')
  .set(Set(['J']), 'Justice')
  .set(Set(['P']), 'Primal')
  .set(Set(['S']), 'Shadow')
  .set(Set(['J', 'P']), 'Hooru')
  .set(Set(['F', 'P']), 'Skycrag')
  .set(Set(['F', 'T']), 'Praxis')
  .set(Set(['J', 'S']), 'Argenport')
  .set(Set(['F', 'J']), 'Rakano')
  .set(Set(['T', 'J']), 'Combrei')
  .set(Set(['F', 'S']), 'Stonescar')
  .set(Set(['T', 'S']), 'Xenan')
  .set(Set(['P', 'S']), 'Feln')
  .set(Set(['T', 'P']), 'Elysian');

function parseSet(setNumber) {
  return SETS.get(setNumber);
}

function parseFaction(influence) {
  const colours = Set(influence.replace(/{|}/g, '').split(''));
  return FACTIONS.get(colours, 'MultiFaction');
}

const ETERNAL_GROUPS = [
  'Faction',
  'Cost - Power',
  'Cost - Influence',
  'Attack',
  'Health',
  'Rarity',
  'Type',
  'Unit Type',
  'Keyword',
  'Set'
];

const ETERNAL_DEFAULT_SORT_ORDER = OrderedMap({
  'Faction': (a, b) => FACTIONS_ORDER.indexOf(a) - FACTIONS_ORDER.indexOf(b),
  'Cost - Power': (a, b) => a - b,
  'Cost - Influence': (a, b) => a.replace(/{|}/g, '').length - b.replace(/{|}/g, '').length,
  'Type': (a, b) => a.localeCompare(b),
  'Rarity': (a, b) => RARITIES_ORDER.indexOf(a) - RARITIES_ORDER.indexOf(b),
  'Attack': (a, b) => a - b,
  'Health': (a, b) => a - b,
  'Unit Type': (a, b) => -1,
  'Keyword': (a, b) => -1,
  'Name': (a, b) => a.localeCompare(b),
  'Set': (a, b) => SETS_ORDER.indexOf(a) - SETS_ORDER.indexOf(b)
});

const ETERNAL_PACK_SORT_ORDER = OrderedMap({
  'Rarity': (a, b) => RARITIES_ORDER.indexOf(a) - RARITIES_ORDER.indexOf(b),
  'Faction': (a, b) => FACTIONS_ORDER.indexOf(a) - FACTIONS_ORDER.indexOf(b),
  'Type': (a, b) => a.localeCompare(b),
  'Cost - Power': (a, b) => a - b,
  'Cost - Influence': (a, b) => a.replace(/{|}/g, '').length - b.replace(/{|}/g, '').length,
  'Attack': (a, b) => a - b,
  'Health': (a, b) => a - b,
  'Unit Type': (a, b) => -1,
  'Keyword': (a, b) => -1,
  'Name': (a, b) => a.localeCompare(b),
  'Set': (a, b) => SETS_ORDER.indexOf(a) - SETS_ORDER.indexOf(b)
});

const ETERNAL_CARDS = List(rawEternalCardData)
  .map((card, index) => new Card(index, card['Name'], card['ImageUrl'], {
    'Set': parseSet(card['SetNumber']),
    'Cost - Power': card['Cost'],
    'Cost - Influence': card['Influence'],
    'Faction': parseFaction(card['Influence']),
    'Attack': card['Attack'],
    'Health': card['Health'],
    'Rarity': card['Rarity'],
    'Type': card['Type'],
    'Unit Type': (card['UnitType'] || []).join(' '),
    'Keyword': 'TODO'
  }, ETERNAL_DEFAULT_SORT_ORDER));

export {ETERNAL_GROUPS, ETERNAL_DEFAULT_SORT_ORDER, ETERNAL_PACK_SORT_ORDER, ETERNAL_CARDS};

