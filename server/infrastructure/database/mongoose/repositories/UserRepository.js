const IUserRepository = require("../../../../domain/repositories/IUserRepository");
const UserModel = require("../models/UserModel");

class UserRepository extends IUserRepository {
  async findByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async findById(id) {
    return await UserModel.findById(id);
  }
  async findAllUsers(conditions) {
    return await UserModel.find(conditions).select('-password');
  }

  async create(userData) {
    return await UserModel.create(userData);
  }
}

module.exports = UserRepository;