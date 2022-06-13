const {ensureAuth, alreadyRated} = require("../middlewares/auth-middleware");
const viewController = require("../controllers/view-controller");
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const multer = require("multer");
const projectController = require("../controllers/project-controller");
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

router.get('/comments/:id', viewController.getComments)

router.get('/create', ensureAuth, (req, res) => {
    res.render('projects/create', {})
})

router.post('/create', ensureAuth, upload.single('image'), viewController.postProject)

router.get('/edit/:id', ensureAuth, viewController.getEditProject)

router.post('/edit/:id', viewController.putProject)

router.get('/delete/:id', ensureAuth, projectController.deleteProject)

router.post('/:id/rate', ensureAuth, alreadyRated, viewController.postRate)

router.post('/:id/comment', ensureAuth, viewController.postComment)

router.get('/:id', viewController.getProject)


module.exports = router