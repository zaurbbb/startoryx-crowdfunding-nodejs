const Errors = require('../exceptions/404-errors')

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
                return Errors.NoAccess(req, res)
            }
            next();
        } catch (e) {
            console.log(e)
            return Errors.NoAccess(req, res)
        }
    }
};