class UserController {
    constructor(userModel) {
      this.userModel = userModel;
    }
  
    async getUsers() {
      return await this.userModel.getUsers();
    }
  
    async getUserById(id) {
      return await this.userModel.getUserById(id);
    }
  }
  
  module.exports = UserController;
  