const UserModel = require("../models/user-model");

class AdminService{
    async getAllUsers() {
        return UserModel.find();
    }
}

module.exports = new AdminService()