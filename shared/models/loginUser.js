import Model from './model';

export default class LoginUser extends Model {
  static properties = ['username', 'password'];

  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

