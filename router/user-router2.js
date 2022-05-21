const Router = require('express').Router
const router = new Router()
const {body} = require('express-validator')
const passport = require('passport')
const userController = require('../controllers/user-controller')
const viewController = require('../controllers/view-controller')
const {ensureAuth, ensureGuest} = require("../middlewares/auth-middleware")
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

// ---Local authorization---

router.post('/registration',
    body('email').isEmail(),
    // body('phone').isMobilePhone(),
    body('password').isLength({min: 3, max: 32}), // TODO: change min
    ensureGuest, userController.registration,
    passport.authenticate('local', {
        successRedirect: "/api/dashboard",
        failureRedirect: "/api/dashboard"
    }));

router.post('/login', ensureGuest,
    passport.authenticate('local', {
        successRedirect: "/api/dashboard",
        failureRedirect: "/api/dashboard"
    }));

router.get('/activation', userController.activationMail)

router.get('/activate/:link', userController.activate)

router.post('/password-reset', userController.passwordReset)

router.get('/password-reset', userController.passwordReset)

router.get('/reset/:link', userController.reset)

router.post('/reset/:link', body('password').isLength({min: 7, max: 32}), userController.updatePassword)



// ---Google authorization---

router.get('/google', ensureGuest,
    passport.authenticate('google', {scope: ['email', 'profile']}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: "/api/dashboard",
    failureRedirect: "/api/dashboard"
}));


// ---Logout---

router.get('/logout', userController.logout);


// ---Views---

router.get('/dashboard/:sort?/:search?', viewController.dashboard);

router.get('/protected', ensureAuth, (req, res) => {
    res.render('pages/protected.ejs', {email: req.user.email, name: req.user.first_name, imgSrc: req.user.image,
        nickname: req.user.nickname})
});

router.post('/donate/:id', userController.donate)

router.get('/profile/:id?', viewController.profile);

router.get('/profile/:id?/balance', userController.deposit);

router.get('/profile/:id?/settings', viewController.profileSettings)

router.post('/files/profile', upload.single('ava', {width: 305, height: 305, crop: "fill"}),
    userController.updateImage)

router.post('/files/profile/settings', userController.updateProfile)



module.exports = router;