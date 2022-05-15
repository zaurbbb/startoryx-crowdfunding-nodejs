const adminService = require("../services/admin-service");


class AdminController{
    async getUsers(req, res, next){
        try{
            const users = await adminService.getAllUsers()
            return res.json(users)
        }
        catch (e) {
            console.log(e)
        }
    }
}

module.exports = new AdminController()