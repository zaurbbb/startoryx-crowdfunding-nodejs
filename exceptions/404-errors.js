class Errors {
    async RatedError(req, res) {
        return res.render('pages/404', {isError: true, message: "You have already rated this project"})
    }
    async BadRequest(req, res) {
        return res.render('pages/404', {isError: true, message: "Bad Request! Validation Error"})
    }
    async NotUploaded(req, res) {
        return res.render('pages/404', {isError: true, message: "File not uploaded"})
    }
    async UnauthorizedError(req, res) {
        return res.render('pages/404', {isError: true, message: "User is not authorized"})
    }
    async NoAccess(req, res) {
        return res.render('pages/404', {isError: true, message: "You don't have access"})
    }
    async AlreadyExist(req, res) {
        return res.render('pages/404', {isError: true, message: "User with this email address already exists"})
    }
    async NotExist(req, res) {
        return res.render('pages/404', {isError: true, message: "User with this email address doesn't exists"})
    }
    async IncorrectLink(req, res) {
        return res.render('pages/404', {isError: true, message: "Incorrect activation link"})
    }
    async NotEnough(req, res) {
        return res.render('pages/404', {isError: true, message: "You don't have enough balance"})
    }
}

module.exports = new Errors()