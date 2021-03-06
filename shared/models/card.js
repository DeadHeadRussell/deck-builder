export default class Card {
  constructor(id, name, imageUrl, token, data, defaultSortOrder) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.token = token;
    this.data = data;
    this.dataString = Object.values(data).join(' ');
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

  search(query) {
    const regex = new RegExp(query, 'i');
    return regex.test(this.name) || regex.test(this.dataString);
  }
}

