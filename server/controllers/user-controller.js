const userService = require('../services/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')

class UserController{
    async registration(req, res, next){
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }
            const {email, password, first_name, last_name, phone, age} = req.body
            await userService.registration(email, password, first_name, last_name, phone, age)
            return next()
        }
        catch (e) {
            next(e)
        }
    }
    async logout(req, res, next){
        try{
            req.logout()
            res.redirect('/api/dashboard')
        }
        catch (e) {
            next(e)
        }
    }
    async activate(req, res, next){
        try{
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        }
        catch (e) {
            next(e)
        }
    }
    async getUsers(req, res, next){
        try{
            const users = await userService.getAllUsers()
            return res.json(users)
        }
        catch (e) {
            next(e)
        }
    }

}

module.exports = new UserController()