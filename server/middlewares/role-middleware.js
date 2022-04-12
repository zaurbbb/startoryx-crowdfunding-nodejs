const ApiError = require('../exceptions/api-error')

module.exports = function (roles) {
    return function (req, res, next) {
        try {
            const userRoles = req.user.roles;

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