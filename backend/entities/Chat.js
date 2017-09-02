module.exports = class Chat {
  constructor({ id, participants, messages }) {
    this._id = id;
    this._participants = [...participants];
    this._messages = messages.map(message => ({
      userId: message.userId,
      text: message.text
    }));
  }

  get id() {
    return this._id;
  }

  get participants() {
    return this._participants;
  }

  get messages() {
    return this._messages;
  }
};
