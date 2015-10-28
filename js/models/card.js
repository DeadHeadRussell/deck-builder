import * as Cards from './cards';

export default class Card {
  constructor(data) {
    this.name = data.name;
    this.cmc = data.cmc;
    this.rarity = data.rarity;
    this.cardtype = data.type;
    this.cost = data.cost;
    this.row = data.row;
    this.text = (data.text || '').toLowerCase();
    this.flip = data.flip;
  }

  get type() {
    if (this.cardtype.includes('Creature')) {
      return 'Creature';
    } else if (this.cardtype.includes('Land')) {
      return 'Land';
    } else if (this.cardtype.includes('Artifact')) {
      return 'Artifact';
    } else if (this.cardtype.includes('Enchantment')) {
      return 'Enchantment';
    } else if (this.cardtype.includes('Planeswalker')) {
      return 'Planeswalker';
    }
    return this.cardtype;
  }

  get colour() {
    let colour = (this.cost || '')
      .split('')
      .filter(letter => Cards.COLOURS.includes(letter))
      .reduce((colours, colour) => {
        if (colours.indexOf(colour) < 0) {
          colours.push(colour);
        }
        return colours;
      }, []);

    if (colour.length == 0) {
      if (this.cost) {
        colour.push('N');
      } else {
        colour.push('E');
      }
    }

    return colour.join('');
  }

  get subtype() {
    if (this.cardtype.includes('Sith') || this.text.includes('hate')) {
      return 'Sith';
    } else if (this.cardtype.includes('Hunter') || this.text.includes('bounty')) {
      return 'Bounty Hunter';
    } else if (this.cardtype.includes('Beast') || this.text.includes('monstrosity')) {
      return 'Wild Beasts';
    } else if (this.cardtype.includes('Jedi') || this.text.includes('meditate')) {
      return 'Jedi';
    } else if (this.cardtype.includes('Droid') || this.text.includes('repair')) {
      return 'Trade Federation';
    } else if (this.cardtype.includes('Trooper') || this.text.includes('tropper')) {
      return 'Troopers';
    } else if (this.cardtype.includes('Starship') || this.text.includes('starship') || this.text.includes('spaceflight')) {
      return 'Starships';
    }
    return 'Other';
  }

  compare(other, columns) {
    for (var i = columns.length - 1; i >= 0; i--) {
      let column = columns[i];
      let value = Card.compareValues(this[column], other[column], column);
      if (value != 0) {
        return value;
      }
    }
    return 0;
  }

  static compareValues(a, b, column) {
    switch (column) {
      case 'pack': return a.localeCompare(b);
      case 'name': return a.localeCompare(b);
      case 'cmc': return parseInt(a, 10) - parseInt(b, 10);
      case 'rarity': return Cards.RARITIES.indexOf(a) - Cards.RARITIES.indexOf(b);
      case 'type': return Cards.TYPES.indexOf(a) - Cards.TYPES.indexOf(b);
      case 'colour': return getColourValue(a) - getColourValue(b);
      case 'subtype': return Cards.SUB_TYPES.indexOf(a) - Cards.SUB_TYPES.indexOf(b);
    }

    function getColourValue(value) {
      return Cards.COLOURS.indexOf(value[0]) + Math.pow(10, value.length);
    }
  }
}

