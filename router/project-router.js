const Router = require('express').Router
const {ensureAuth, alreadyRated} = require('../middlewares/auth-middleware')
const router = new Router()
const viewController = require('../controllers/view-controller')
const projectController = require('../controllers/project-controller')
const userController = require("../controllers/user-controller");


router.get('/:id', viewController.getProject)

router.post('/:id/comment', ensureAuth, viewController.postComment)

router.post('/:id/rate', ensureAuth, alreadyRated, viewController.postRate)

router.get('/delete/:id', ensureAuth, projectController.deleteProject)

module.exports = router