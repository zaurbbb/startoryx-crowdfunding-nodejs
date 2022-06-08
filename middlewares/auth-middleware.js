const Errors = require('../exceptions/404-errors')
const Project = require('../models/project-model')

module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            return Errors.UnauthorizedError(req, res)
        }
    },

    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/profile')
        } else {
            return next()
        }
    },

    alreadyRated: async function (req, res, next) {
        try {
            let isEqual = false
            const project = await Project.findById(req.params.id).populate('rates')
            project.rates.some(function (rate) {
                if (rate.user.equals(req.user._id)) {
                    isEqual = true
                    return true
                }
            })
            if (isEqual)
                return Errors.RatedError(req, res)
            return next()
        } catch (e) {
            console.log(e)
        }
    }
}