const Router = require('express').Router
const router = new Router()
const userController = require('../controllers/user-controller')
const viewController = require('../controllers/view-controller')

router.get('/dashboard/:sort?/:search?', viewController.dashboard);

router.post('/donate/:id', userController.donate)


module.exports = router;