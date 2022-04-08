const Router = require('express').Router
const userController = require('../controllers/user-controller')
const router = new Router()
const {body} = require('express-validator')
const roleMiddleware = require('../middlewares/role-middleware')

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}), // TODO: change min
    userController.registration
)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', roleMiddleware(['ADMIN']), userController.getUsers)

module.exports = router