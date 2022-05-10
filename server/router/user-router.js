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

router

// ---Local authorization---

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}), // TODO: change min
    ensureGuest, userController.registration,
    passport.authenticate('local', {
        successRedirect: "/api/protected",
        failureRedirect: "/api/dashboard"
    }));

router.post('/login', ensureGuest,
    passport.authenticate('local', {
        successRedirect: "/api/protected",
        failureRedirect: "/api/dashboard"
    }));

router.get('/activation', userController.activationMail)

router.get('/activate/:link', userController.activate)


// ---Google authorization---

router.get('/google', ensureGuest,
    passport.authenticate('google', {scope: ['email', 'profile']}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: "/api/protected",
    failureRedirect: "/"
}));


// ---Logout---

router.get('/logout', userController.logout);


// ---Views---

router.get('/dashboard/:sort?/:search?', viewController.dashboard);

router.get('/protected', ensureAuth, (req, res) => {
    res.render('pages/protected.ejs', {email: req.user.email, name: req.user.first_name, imgSrc: req.user.image,
        id: req.user._id})
});

router.get('/profile/:id?', ensureAuth, viewController.profile);


module.exports = router;