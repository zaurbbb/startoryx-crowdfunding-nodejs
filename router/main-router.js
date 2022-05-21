const Router = require('express').Router
const router = new Router()
const viewController = require('../controllers/view-controller')

router.get('/faq', viewController.faq)

module.exports = router