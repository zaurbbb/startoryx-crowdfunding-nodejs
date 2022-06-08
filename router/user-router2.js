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

router.get('/dashboard/:sort?/:search?', viewController.dashboard);

router.post('/donate/:id', userController.donate)

router.post('/files/profile', upload.single('ava', {width: 305, height: 305, crop: "fill"}),
    userController.updateImage)

router.post('/files/profile/settings', userController.updateProfile)



module.exports = router;