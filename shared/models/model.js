export default class Model {
  static fromJson(json) {
    const parsedJson = JSON.parse(json);
    const values = this.properties
      .map(propertyName => parsedJson[propertyName]);
    return new this.constructor(...values);
  }

  toJson() {
    return JSON.stringify(this);
  }
}

