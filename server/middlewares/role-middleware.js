const ApiError = require('../exceptions/api-error')
const tokenService = require('../services/token-service')

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return next(ApiError.NoAccess())
            }
            const {roles: userRoles} = tokenService.validateAccessToken(token)
            let hasRole = false
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })
            if (!hasRole) {
                return next(ApiError.NoAccess())
            }
            next();
        } catch (e) {
            console.log(e)
            return next(ApiError.NoAccess())
        }
    }
};