const {ensureAuth} = require("../middlewares/auth-middleware");
const viewController = require("../controllers/view-controller");
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const multer = require("multer");
const Router = require('express').Router
const router = new Router()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "PROJECTS",
    },
});

const upload = multer({storage: storage});

router.get('/:id', viewController.getProject)

router.get('/comments/:id', viewController.getComments)

router.get('/create', ensureAuth, (req, res) => {
    res.render('projects/create', {})
})

router.post('/create', ensureAuth, upload.single('image'), viewController.postProject)

router.get('/edit/:id', viewController.getEditProject)

router.post('/edit/:id', viewController.putProject)

module.exports = router