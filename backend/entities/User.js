module.exports = class User {
  constructor({ id, username, role, isBanned }) {
    this._id = id;
    this._username = username;
    this._role = role;
    this._isBanned = isBanned;
  }

  get id() {
    return this._id;
  }

  get username() {
    return this._username;
  }

  get role() {
    return this._role;
  }

  get isBanned() {
    return this._isBanned;
  }
};
