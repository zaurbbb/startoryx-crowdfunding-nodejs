const ApiError = require('../exceptions/api-error')

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
    }

}