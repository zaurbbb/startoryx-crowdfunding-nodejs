const Router = require('express').Router
const Project = require('../models/project-model')
const { ensureAuth } = require('../middlewares/auth-middleware')
const router = new Router()


router.get('/add', ensureAuth, (req, res) => {
    res.render('projects/add', {email: req.user.email})
})

router.post('/add', ensureAuth, async (req, res) => {
    try{
        req.body.user = req.user._id
        console.log(req.body.user)
        const project = await Project.create(req.body)
        console.log(project)
        res.redirect('/api/dashboard')
    }
    catch (e) {
        console.log(e)
    }
})

module.exports = router