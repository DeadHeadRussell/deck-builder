import Model from './model';

export default class User extends Model {
  static properties = ['username'];

  constructor(username) {
    this.username = username;
  }
}

