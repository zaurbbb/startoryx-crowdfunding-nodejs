const ApiError = require('../exceptions/api-error')
const Project = require('../models/project-model')

module.exports = {
    ensureAuth: function (req, res, next){
        if (req.isAuthenticated()){
            return next()
        }
        else {
            res.send(ApiError.UnauthorizedError().message)
        }
    },

    ensureGuest: function (req, res, next){
        if (req.isAuthenticated()){
            res.redirect('/api/dashboard')
        }
        else{
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
            if (isEqual) {
                res.send(ApiError.RatedError().message)
            } else {
                return next()
            }
        } catch (e) {
            console.log(e)
        }
    }
}