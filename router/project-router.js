const Router = require('express').Router
const {ensureAuth, alreadyRated} = require('../middlewares/auth-middleware')
const router = new Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const viewController = require('../controllers/view-controller')
const projectController = require('../controllers/project-controller')


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


router.get('/add', ensureAuth, (req, res) => {
    res.render('projects/add.ejs', {email: req.user.email, nickname: req.user.nickname})
})

router.post('/add', ensureAuth, upload.single('image', {width: 305, height: 305, crop: "fill"}), viewController.postProject)

router.get('/edit/:id', viewController.getEditProject)

router.post('/edit/:id', viewController.putProject)

router.get('/:id', viewController.getProject)

router.post('/:id/comment', ensureAuth, viewController.postComment)

router.post('/:id/rate', ensureAuth, alreadyRated, viewController.postRate)

router.get('/delete/:id', ensureAuth, projectController.deleteProject)

module.exports = router