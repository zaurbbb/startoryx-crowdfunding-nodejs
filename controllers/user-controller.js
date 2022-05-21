const userService = require('../services/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')
const User = require('../models/user-model')

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
            res.redirect(process.env.CLIENT_URL);
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
            res.send('A confirmation link has been sent to your email')
        } catch (e) {
            next(e)
        }
    }

    async reset(req, res, next) {
        try {
            const resetLink = req.params.link;
            await userService.reset(resetLink);
            res.render('pages/password_change.ejs', {
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
            res.redirect('/api/dashboard')
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
            const {nickname, first_name, last_name, phone, age} = req.body
            await userService.updateProfile(req.user.email, nickname, first_name, last_name, age, phone)
            res.redirect('/api/profile/' + req.user.nickname)
        }
        catch (e) {
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