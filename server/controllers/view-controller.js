const Project = require("../models/project-model");
const User = require("../models/user-model")
const Comment = require("../models/comment-model");
const Rate = require("../models/rate-model");
const projectController = require("./project-controller");
const ApiError = require('../exceptions/api-error')
const formatDate = require("../helpers/formatDate");
const averageRate = require("../helpers/averageRate");

// TODO: Redirect and create view-service
class ViewController {
    async dashboard(req, res, next) {
        try {
            let search = null
            let projects
            if (req._parsedUrl.query === "search=") {
                req._parsedUrl.query = null
            }
            if (req._parsedUrl.query != null) {
                const str = req._parsedUrl.query
                search = str.split('=', 2)[1]
                projects = await Project.find({published: true, $text: {$search: search}}).lean()
            } else {
                projects = await Project.find({published: true}).lean()
            }
            const sortedProjects = await projectController.ProjectSort(projects, parseInt(req.params.sort) || 0)
            let email, nickname = null
            if (req.user != null) {
                email = req.user.email
                nickname = req.user.nickname
            }

            let searchUrl = "search="
            if (req._parsedUrl.query != null) searchUrl = req._parsedUrl.query
            res.render('pages/dashboard.ejs', {
                email: email, date: formatDate, projects: sortedProjects, search: searchUrl,
                nickname: nickname
            })
        } catch (e) {
            next(e)
        }
    }

    async getProject(req, res, next) {
        try {
            let email, nickname = null
            if (req.user != null) {
                email = req.user.email
                nickname = req.user.nickname
            }
            await Project.findById(req.params.id).populate({
                path: 'comments', model: 'Comment',
                populate: {path: 'user', model: 'User'}
            }).populate('user').exec(function (err, project) {
                if (err) {
                    console.log(err)
                }
                res.render('projects/read.ejs', {email: email, date: formatDate, project: project, nickname: nickname})
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
                res.render('projects/edit.ejs', {email: req.user.email, project: project, nickname: req.user.nickname})
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
            if (req.params.id == null) {
                req.params.id = req.user.nickname
            }
            const user = await User.findOne({nickname: req.params.id})
            if (user == null) {
                return next(ApiError.NotExist())
            }
            let email, nickname
            if (req.user == null) {
                email = null
                nickname = null
            } else {
                email = req.user.email
                nickname = req.user.nickname
            }

            let projects = await Project.find({user: user._id}).lean()

            if (req.user != null && user._id.equals(req.user._id)) {
                res.render('pages/personal_profile.ejs', {
                    email: req.user.email, user: user, nickname: req.user.nickname,
                    projects: projects, date: formatDate
                })
            } else {
                res.render('pages/profile.ejs', {
                    email: email, user: user, nickname: nickname,
                    projects: projects, date: formatDate
                })
            }
        } catch (e) {
            next(e)
        }
    }

    async profileSettings(req, res, next) {
        try {
            const user = await User.findOne({nickname: req.params.id})
            if (user == null) {
                return next(ApiError.NotExist())
            }
            let email, nickname
            if (req.user == null) {
                email = null
                nickname = null
            } else {
                email = req.user.email
                nickname = req.user.nickname
            }

            res.render('pages/settings.ejs', {
                email: email, user: user, nickname: nickname,
                date: formatDate
            })
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ViewController()