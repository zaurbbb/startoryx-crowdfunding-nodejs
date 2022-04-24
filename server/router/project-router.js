const Router = require('express').Router
const Project = require('../models/project-model')
const {ensureAuth} = require('../middlewares/auth-middleware')
const router = new Router()
const formatDate = require('../helpers/formatDate')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require("multer-storage-cloudinary");


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

const upload = multer({ storage: storage });

router.get('/add', ensureAuth, (req, res) => {
    res.render('projects/add.ejs', {email: req.user.email})
})

router.post('/add', ensureAuth, upload.single('image', { width: 305, height: 305, crop: "fill"}), async (req, res) => {
    try {
        req.body.user = req.user._id
        req.body.image = req.file.path
        const project = await Project.create(req.body)
        console.log(project)
        res.redirect('/api/dashboard')
    } catch (e) {
        console.log(e)
    }
})

router.get('/edit/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).lean()
        if (project.user.equals(req.user._id))
            res.render('projects/edit.ejs', {email: req.user.email, project: project})
        else
            res.redirect('/api/dashboard')
    } catch (e) {
        console.log(e)
    }
})

router.put('/:id', async (req, res) => {
    try {
        await Project.findOneAndUpdate(
            {_id: req.params.id},
            {title: req.body.title, body: req.body.body, shortly: req.body.shortly, days: req.body.days,
            type: req.body.type, goal: req.body.goal})
        res.redirect('/api/dashboard')
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).lean()
        res.render('projects/read.ejs', {email: req.user.email, date: formatDate, project: project})
    } catch (e) {
        console.log(e)
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).lean()
        if (project.user.equals(req.user._id))
            await Project.deleteOne({_id: req.params.id})

        res.redirect('/api/dashboard')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router