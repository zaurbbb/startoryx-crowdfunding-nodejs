const Router = require('express').Router
const Project = require('../models/project-model')
const Comment = require('../models/comment-model')
const Rate = require('../models/rate-model')
const {ensureAuth} = require('../middlewares/auth-middleware')
const router = new Router()
const formatDate = require('../helpers/formatDate')
const averageRate = require('../helpers/averageRate')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const authMiddleware = require("../middlewares/auth-middleware")


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
    res.render('projects/add.ejs', {email: req.user.email})
})

router.post('/add', ensureAuth, upload.single('image', {width: 305, height: 305, crop: "fill"}), async (req, res) => {
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
            {
                title: req.body.title, body: req.body.body, shortly: req.body.shortly, days: req.body.days,
                type: req.body.type, goal: req.body.goal
            })
        res.redirect('/api/dashboard')
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        let email = null
        if (req.user != null) email = req.user.email
        await Project.findById(req.params.id).populate({path: 'comments', model: 'Comment',
        populate: {path: 'user', model: 'User'}}).populate('user').
        exec(function(err, project) {
            if (err) {
                console.log(err)
            }
            res.render('projects/read.ejs', {email: email, date: formatDate, project: project})
        })

    } catch (e) {
        console.log(e)
    }
})

router.post('/:id/comment', authMiddleware.ensureAuth, async (req, res) => {
    try {
        req.body.project = req.params.id
        req.body.user = req.user._id
        const comment = await Comment.create(req.body)
        await Project.findOneAndUpdate(
            {_id: req.params.id},
            {$push: {comments: comment}})

        console.log(comment)
        res.redirect('back')
    }
    catch (e) {
        console.log(e)
    }
})

router.post('/:id/rate', authMiddleware.ensureAuth, authMiddleware.alreadyRated, async (req, res) => {
    try {
        req.body.rate = parseInt(req.body.rate)
        req.body.project = req.params.id
        req.body.user = req.user._id
        const rate = await Rate.create(req.body)
        await Project.findOneAndUpdate(
            {_id: req.params.id},
            {$push: {rates: rate}})

        await Project.findOneAndUpdate({
            _id: req.params.id}, {
            avgRate: await averageRate(req.params.id)
        })
        console.log(rate)
        res.redirect('back')
    }
    catch (e) {
        console.log(e)
    }
})


// router.delete('/delete/:id', async (req, res) => {
//     try {
//         const project = await Project.findById(req.params.id).lean()
//         if (project.user.equals(req.user._id))
//             await Project.deleteOne({_id: req.params.id})
//
//         res.redirect('/api/dashboard')
//     } catch (e) {
//         console.log(e)
//     }
// })

module.exports = router