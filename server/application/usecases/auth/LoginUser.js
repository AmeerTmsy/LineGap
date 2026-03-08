const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class LoginUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("We found you'r new to here, please signup");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    };
  }
}

module.exports = LoginUser;