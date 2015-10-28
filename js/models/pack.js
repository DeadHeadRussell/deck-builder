import * as Cards from './cards';

export default class Pack {
  constructor(cards) {
    if (cards) {
      this.cards = cards;
    } else {
      this.cards = Cards.getRare().concat(Cards.getUncommons()).concat(Cards.getCommons());
    }
  }

  static FROM_NAMES(names) {
    return new Pack(Cards.fromNames(names));
  }
}

