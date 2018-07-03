export default class Card {
  constructor(id, name, imageUrl, data, defaultSortOrder) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.data = data;
    this.defaultSortOrder = defaultSortOrder;
  }

  getValue(grouping) {
    const value = this.data[grouping];
    return typeof value == 'undefined'
      ? ''
      : value;
  }

  compare(other, grouping) {
    const sortOrder = grouping
      ? this.defaultSortOrder.remove(grouping)
      : this.defaultSortOrder;

    return sortOrder
      .reduce(
        (sortValue, sort, column) => {
          if (sortValue != 0) {
            return sortValue;
          }
          return sort(this.getValue(column), other.getValue(column));
        },
        0
      );
  }
}

