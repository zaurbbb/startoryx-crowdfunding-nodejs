const Router = require('express').Router
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const passport = require('passport')
const {body} = require('express-validator')
const roleMiddleware = require('../middlewares/role-middleware')
const authMiddleware = require("../middlewares/auth-middleware")
const projectController = require('../controllers/project-controller')
const router = new Router()
const formatDate = require('../helpers/formatDate')
const projectService = require('../services/project-service')
const Project = require("../models/project-model");

// ---Local authorization---

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}), // TODO: change min
    authMiddleware.ensureGuest, userController.registration,
    passport.authenticate('local', {
        successRedirect: "/api/protected",
        failureRedirect: "/api/dashboard"
    }));

router.post('/login', authMiddleware.ensureGuest,
    passport.authenticate('local', {
        successRedirect: "/api/protected",
        failureRedirect: "/api/dashboard"
    }));

router.get('/activate/:link', userController.activate)


// ---Google authorization---

router.get('/google', authMiddleware.ensureGuest,
    passport.authenticate('google', {scope: ['email', 'profile']}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: "/api/protected",
    failureRedirect: "/"
}));


// ---Logout---

router.get('/logout', userController.logout);


// ---Admin routers---

router.get('/users', roleMiddleware(['ADMIN']), adminController.getUsers);


// ---Views---

router.get('/dashboard/:id?', async (req, res) => {
    try {
        const projects = await Project.find().lean()
        const sortedProjects = await projectController.ProjectSort(projects, parseInt(req.params.id) || 0)
        let email = null
        if (req.user != null) {
            email = req.user.email
        }

        res.render('pages/dashboard.ejs', {email: email, date: formatDate, projects: sortedProjects})
    }
    catch (e) {
        console.log(e)
    }
})

router.get('/protected', authMiddleware.ensureAuth, (req, res) => {
    res.render('pages/protected.ejs', {email: req.user.email, name: req.user.first_name, imgSrc: req.user.image})
});


module.exports = router;