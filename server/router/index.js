const Router = require('express').Router
const userController = require('../controllers/user-controller')
const router = new Router()
const passport = require('passport')
const {body} = require('express-validator')
const roleMiddleware = require('../middlewares/role-middleware')
const authMiddleware = require("../middlewares/auth-middleware");


// ---Local authorization---

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}), // TODO: change min
    userController.registration, passport.authenticate('local', {
        successRedirect: "/api/protected",
        failureRedirect: "/api/dashboard"
    }) );

router.post('/login', passport.authenticate('local', {
    successRedirect: "/api/protected",
    failureRedirect: "/api/dashboard"}));

router.get('/activate/:link', userController.activate)


// ---Google authorization---

router.get('/google', authMiddleware.ensureGuest,
    passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: "/api/protected",
    failureRedirect: "/"}));


// ---Logout---

router.get('/logout', userController.logout);


// ---Admin routers---

router.get('/users', roleMiddleware(['ADMIN']), userController.getUsers);


// ---Views---

router.get('/dashboard', (req, res) =>{
    res.render('dashboard')
});

router.get('/protected', authMiddleware.ensureAuth, (req, res) =>{
    res.render('protected', {name: req.user.first_name})
});



module.exports = router;