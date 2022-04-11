const Router = require('express').Router
const userController = require('../controllers/user-controller')
const router = new Router()
const passport = require('passport')
const {body} = require('express-validator')
const roleMiddleware = require('../middlewares/role-middleware')

function isLoggedIn(req, res, next){
    req.user ? next() : res.sendStatus(401)
}

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}), // TODO: change min
    userController.registration
)
router.post('/login', userController.login)
router.post('/logout', userController.logout)


router.get('/googleLog', (req, res) =>{
    res.render('login')
})
router.get('/dashboard', (req, res) =>{
    res.render('dashboard')
})
router.get('/protected', isLoggedIn, (req, res) =>{
    res.render('protected')
})

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: "/api/protected",
    failureRedirect: "/"}),
    (req, res) => {
        res.redirect('/api/dashboard')
    });

router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', roleMiddleware(['ADMIN']), userController.getUsers)

module.exports = router