const Project = require("../models/project-model");
const Comment = require("../models/comment-model");
const Rate = require("../models/rate-model");
const projectController = require("./project-controller");
const formatDate = require("../helpers/formatDate");
const averageRate = require("../helpers/averageRate");


class ViewController {
    async dashboard(req, res, next) {
        try {
            let search = null
            let projects
            if (req._parsedUrl.query != null) {
                const str = req._parsedUrl.query
                search = str.split('=', 2)[1]
                projects = await Project.find({published: true, $text: {$search: search}}).lean()
            } else {
                projects = await Project.find({published: true}).lean()
            }
            const sortedProjects = await projectController.ProjectSort(projects, parseInt(req.params.sort) || 0)
            let email, userId = null
            if (req.user != null) {
                email = req.user.email
                userId = req.user._id
            }

            let searchUrl = "search="
            if (req._parsedUrl.query != null) searchUrl = req._parsedUrl.query
            res.render('pages/dashboard.ejs', {
                email: email, date: formatDate, projects: sortedProjects, search: searchUrl,
                id: userId
            })
        } catch (e) {
            next(e)
        }
    }

    async getProject(req, res, next) {
        try {
            let email, userId = null
            if (req.user != null) {
                email = req.user.email
                userId = req.user._id
            }
            await Project.findById(req.params.id).populate({
                path: 'comments', model: 'Comment',
                populate: {path: 'user', model: 'User'}
            }).populate('user').exec(function (err, project) {
                if (err) {
                    console.log(err)
                }
                res.render('projects/read.ejs', {email: email, date: formatDate, project: project, id: userId})
            })
        } catch (e) {
            next(e)
        }
    }

    async putProject(req, res, next) {
        try {
            await Project.findOneAndUpdate(
                {_id: req.params.id},
                {
                    title: req.body.title, body: req.body.body, shortly: req.body.shortly, days: req.body.days,
                    type: req.body.type, goal: req.body.goal, published: false
                })
            res.send('Submitted for approval by moderation')
        } catch (e) {
            next(e)
        }
    }

    async getEditProject(req, res, next) {
        try {
            const project = await Project.findById(req.params.id).lean()
            if (project.user.equals(req.user._id))
                res.render('projects/edit.ejs', {email: req.user.email, project: project, id: req.user._id})
            else
                res.redirect('/api/dashboard')

        } catch (e) {
            next(e)
        }
    }

    async postProject(req, res, next) {
        try {
            req.body.user = req.user._id
            if (req.file != null)
                req.body.image = req.file.path
            const project = await Project.create(req.body)
            console.log(project)
            res.send('Submitted for approval by moderation')
        } catch (e) {
            next(e)
        }
    }

    async postComment(req, res, next) {
        try {
            req.body.project = req.params.id
            req.body.user = req.user._id
            const comment = await Comment.create(req.body)
            await Project.findOneAndUpdate(
                {_id: req.params.id},
                {$push: {comments: comment}})

            console.log(comment)
            res.redirect('back')
        } catch (e) {
            next(e)
        }
    }

    async postRate(req, res, next) {
        try {
            req.body.rate = parseInt(req.body.rate)
            req.body.project = req.params.id
            req.body.user = req.user._id
            const rate = await Rate.create(req.body)
            await Project.findOneAndUpdate(
                {_id: req.params.id},
                {$push: {rates: rate}})

            await Project.findOneAndUpdate({
                _id: req.params.id
            }, {
                avgRate: await averageRate(req.params.id)
            })
            console.log(rate)
            res.redirect('back')
        } catch (e) {
            next(e)
        }
    }

    async profile(req, res, next) {
        try {
            let projects = await Project.find({user: req.user._id}).lean()
            res.render('pages/profile.ejs', {email: req.user.email, id: req.user._id, user: req.user,
            projects: projects, date: formatDate})
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ViewController()