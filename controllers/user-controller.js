const userService = require('../services/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')
const User = require('../models/user-model')

class UserController {
    async registration(req, res, next) {
        try {
            const {email, nickname, password, repeat_password, first_name, last_name, phone, age} = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty() || password !== repeat_password) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }
            await userService.registration(email, nickname, password, first_name, last_name, phone, age)
            return next()
        } catch (e) {
            next(e)
        }
    }
    async activationMail(req, res, next) {
        try {
            await userService.activationMail(req.user._id)
            res.redirect('back')
        } catch (e) {
            next(e)
        }
    }
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            res.redirect('/profile');
        } catch (e) {
            next(e)
        }
    }
    async logout(req, res, next) {
        try {
            req.logout()
            res.redirect('/login')
        } catch (e) {
            next(e)
        }
    }
    async passwordReset(req, res, next) {
        try {
            if (req.user != null)
                await userService.passwordReset(req.user._id, null)
            else
                await userService.passwordReset(null, req.body.email)
            req.logout()
            res.redirect('/login')
        } catch (e) {
            next(e)
        }
    }
    async reset(req, res, next) {
        try {
            const resetLink = req.params.link;
            await userService.reset(resetLink);
            res.render('pages/change_password.ejs', {
                link: resetLink
            });
        } catch (e) {
            next(e)
        }
    }
    async updatePassword(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty() || req.body.password !== req.body.confirm_pass) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }
            await userService.updatePassword(req.params.link, req.body.password)
            res.redirect('/profile')
        } catch (e) {
            next(e)
        }
    }
    async updateImage(req, res, next) {
        try {
            if (req.file == null){
                return next(ApiError.NotUploaded())
            }
            await User.findOneAndUpdate(
                {_id: req.user.id},
                {image: req.file.path}
            )
            res.redirect('back')
        } catch (e) {
            next(e)
        }
    }
    async updateProfile(req, res, next) {
        try {
            const {nickname, phone, age, specialist} = req.body
            await userService.updateProfile(req.user.email, nickname, age, phone, specialist)
            res.redirect('back')
        }
        catch (e) {
            next(e)
        }
    }
    async donate(req, res, next) {
        try {
            await userService.donate(req.user._id, req.params.id, req.body.amount)
            res.redirect('back')
        }
        catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()