const Router = require('express').Router
const router = new Router()
const {body} = require('express-validator')
const passport = require('passport')
const userController = require('../controllers/user-controller')
const viewController = require('../controllers/view-controller')
const authMiddleware = require("../middlewares/auth-middleware")

// ---Local authorization---

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}), // TODO: change min
    authMiddleware.ensureGuest, userController.registration,
    passport.authenticate('local', {
        successRedirect: "/api/protected",
        failureRedirect: "/api/dashboard"
    }));

router.post('/login', authMiddleware.ensureGuest,
    passport.authenticate('local', {
        successRedirect: "/api/protected",
        failureRedirect: "/api/dashboard"
    }));

router.get('/activate/:link', userController.activate)


// ---Google authorization---

router.get('/google', authMiddleware.ensureGuest,
    passport.authenticate('google', {scope: ['email', 'profile']}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: "/api/protected",
    failureRedirect: "/"
}));


// ---Logout---

router.get('/logout', userController.logout);


// ---Views---

router.get('/dashboard/:sort?/:search?', viewController.dashboard);

// router.post('/dashboard/:sort?/:search?', viewController.dashboard);


router.get('/protected', authMiddleware.ensureAuth, (req, res) => {
    res.render('pages/protected.ejs', {email: req.user.email, name: req.user.first_name, imgSrc: req.user.image})
});


module.exports = router;