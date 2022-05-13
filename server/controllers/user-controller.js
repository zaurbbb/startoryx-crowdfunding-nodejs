const userService = require('../services/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')
const User = require("../models/user-model");

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }
            const {email, nickname, password, first_name, last_name, phone, age} = req.body
            await userService.registration(email, nickname, password, first_name, last_name, phone, age)
            return next()
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            req.logout()
            res.redirect('/api/dashboard')
        } catch (e) {
            next(e)
        }
    }

    async activationMail(req, res, next) {
        try {
            const id = req.user._id
            console.log(id)
            await userService.activationMail(id)
            return res.redirect('back')
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e)
        }
    }

    async updateImage(req, res, next) {
        try {
            if (req.file == null){
                return next(ApiError.NotUploaded())
            }
            const user = await User.findOneAndUpdate(
                {_id: req.user.id},
                {image: req.file.path}
            )
            res.redirect('back')
        } catch (e) {
            next(e)
        }
    }

    async deposit(req, res, next) {
        try {
            const user = await User.findOne({_id: req.user.id})
            await User.updateOne({_id: user.id}, {balance: user.balance + 10})
            res.redirect('back')
        }
        catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()