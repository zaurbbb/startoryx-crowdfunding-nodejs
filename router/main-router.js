const Router = require('express').Router
const router = new Router()
const viewController = require('../controllers/view-controller')
const paymentController = require('../controllers/payment-controller')
const {body} = require("express-validator");
const {ensureGuest} = require("../middlewares/auth-middleware");
const userController = require("../controllers/user-controller");
const passport = require("passport");
const {v2: cloudinary} = require("cloudinary");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "AVATARS",
    },
});

const upload = multer({storage: storage});


router.get('/registration', viewController.registration)

router.get('/login', viewController.login)

router.get('/forget', viewController.forget)

router.get('/logout', userController.logout)

router.post('/password-reset', userController.passwordReset)

router.get('/password-reset', userController.passwordReset)

router.get('/activation', userController.activationMail)

router.get('/activate/:link', userController.activate)

router.get('/reset/:link', userController.reset)

router.post('/reset/:link', body('password').isLength({min: 4, max: 32}), userController.updatePassword)

router.post('/registration',
    body('email').isEmail(),
    // body('phone').isMobilePhone(),
    body('password').isLength({min: 3, max: 32}), // TODO: change min
    ensureGuest, userController.registration,
    passport.authenticate('local', {
        successRedirect: "/profile",
        failureRedirect: "/registration"
    }));

router.post('/login', ensureGuest,
    passport.authenticate('local', {
        successRedirect: "/profile",
        failureRedirect: "/login"
    }));

router.get('/google', ensureGuest,
    passport.authenticate('google', {
        scope: ['email', 'profile'],
    }));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: "/profile",
    failureRedirect: "/login"
}));

router.get('/profile/:id?', viewController.profile);

router.get('/profile/settings/:id?', viewController.profileSettings)

router.post('/files/profile', upload.single('ava', {width: 305, height: 305, crop: "fill"}),
    userController.updateImage)

router.post('/files/profile/settings', userController.updateProfile)

router.post('/pay', paymentController.payment)

router.post('/donate_paypal/:id', paymentController.donatePaypal)

router.get('/success/:amount', paymentController.successPayment)

router.get('/donate_success/:amount/:id', paymentController.donateSuccess)

router.get('/faq', viewController.faq)

module.exports = router