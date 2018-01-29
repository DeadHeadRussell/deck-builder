import Model from './model';

export default class Event extends Model {
  static properties = ['id', 'type'];

  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
}

