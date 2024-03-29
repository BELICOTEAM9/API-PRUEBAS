class UserModel {
    constructor(dataAccessLayer) {
      this.dataAccessLayer = dataAccessLayer;
    }
  
    async getUsers() {
      return await this.dataAccessLayer.getUsers();
    }
  
    async getUserById(id) {
      return await this.dataAccessLayer.getUserById(id);
    }
  }
  
  module.exports = UserModel;
  