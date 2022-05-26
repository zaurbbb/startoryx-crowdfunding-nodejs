const Router = require('express').Router
const router = new Router()
const viewController = require('../controllers/view-controller')
const paymentController = require('../controllers/payment-controller')


router.get('/profile/:id?', viewController.profile);

router.get('/profile/settings/:id?', viewController.profileSettings)

router.post('/pay', paymentController.payment)

router.post('/donate_paypal/:id', paymentController.donatePaypal)

router.get('/success/:amount', paymentController.successPayment)

router.get('/donate_success/:amount/:id', paymentController.donateSuccess)


router.get('/faq', viewController.faq)

module.exports = router