class User {
  constructor({ id, name, email, password, profilePic }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.profilePic = profilePic;
  }
}

module.exports = User;