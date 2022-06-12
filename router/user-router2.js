const Router = require('express').Router
const router = new Router()
const viewController = require('../controllers/view-controller')

router.get('/dashboard/:sort?/:search?', viewController.dashboard);

module.exports = router;