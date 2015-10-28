class Board {
  constructor() {
    this.packs = [];
    this.cards = [];
    this.noPack = [];
  }

  addPack(pack) {
    this.packs.push(pack);
    this.cards = this.cards.concat(pack);
  }

  addCard(card) {
    this.cards.push(card);
    this.noPack.push(card);
  }
}

