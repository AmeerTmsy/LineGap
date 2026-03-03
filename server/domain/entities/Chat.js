class Chat {
  constructor({ id, chatName, isGroupChat, users, groupAdmin }) {
    this.id = id;
    this.chatName = chatName;
    this.isGroupChat = isGroupChat;
    this.users = users;
    this.groupAdmin = groupAdmin;
  }
}

module.exports = Chat;