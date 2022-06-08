const userService = require('../services/user-service')
const {validationResult} = require('express-validator')
const Errors = require('../exceptions/404-errors')
const User = require('../models/user-model')

class UserController {
    async registration(req, res, next) {
        try {
            const {email, nickname, password, repeat_password, first_name, last_name, phone, age} = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty() || password !== repeat_password) {
                return Errors.BadRequest(req, res)
            }
            if (await User.findOne({email})) return Errors.AlreadyExist(req, res)
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
            if (!await User.findOne({activationLink})) return Errors.IncorrectLink(req, res)
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
            if(!await User.findOne({resetLink})) return Errors.IncorrectLink(req, res)

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
                return Errors.BadRequest(req, res)
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
                return Errors.NotUploaded(req, res)
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
            res.redirect('/profile')
        }
        catch (e) {
            next(e)
        }
    }
    async donate(req, res, next) {
        try {
            const user = await User.findOne({_id: req.user._id})
            if (user.balance < req.body.amount) return Errors.NotEnough(req, res)

            await userService.donate(req.user._id, req.params.id, req.body.amount)
            res.redirect('back')
        }
        catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()