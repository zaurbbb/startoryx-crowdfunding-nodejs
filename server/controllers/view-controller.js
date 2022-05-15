const Project = require("../models/project-model");
const User = require("../models/user-model")
const Comment = require("../models/comment-model");
const Rate = require("../models/rate-model");
const projectController = require("./project-controller");
const viewService = require('../services/view-service')
const ApiError = require('../exceptions/api-error')
const formatDate = require("../helpers/formatDate");
const averageRate = require("../helpers/averageRate");

// TODO: Redirect and create view-service
class ViewController {
    async dashboard(req, res, next) {
        try {
            let email, nickname
            if (req.user != null) {
                email = req.user.email
                nickname = req.user.nickname
            }
            const board = await viewService.projectBoard(req._parsedUrl.query, req.params.sort)
            res.render('pages/dashboard.ejs', {
                email: email, date: formatDate, projects: board.projects, search: board.search,
                nickname: nickname
            })
        } catch (e) {
            next(e)
        }
    }

    async getProject(req, res, next) {
        try {
            let email, nickname
            if (req.user != null) {
                email = req.user.email
                nickname = req.user.nickname
            }

            const project = await Project.findById(req.params.id).populate({
                path: 'comments', model: 'Comment',
                populate: {path: 'user', model: 'User'}
            }).populate('user')

            res.render('projects/read.ejs', {email: email, date: formatDate, project: project, nickname: nickname})
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
            if (req.file != null) req.body.image = req.file.path
            await Project.create(req.body)
            res.send('Submitted for approval by moderation')
        } catch (e) {
            next(e)
        }
    }

    async postComment(req, res, next) {
        try {
            req.body.project = req.params.id
            req.body.user = req.user._id

            await viewService.postComment(req.body)
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

            await viewService.postRate(req.body)
            res.redirect('back')
        } catch (e) {
            next(e)
        }
    }

    async profile(req, res, next) {
        try {
            let email, nickname
            if (req.user != null) {
                email = req.user.email
                nickname = req.user.nickname
            }
            if (req.params.id == null) {
                req.params.id = nickname
            }

            const profile = await viewService.profile(req.params.id)

            if (req.user != null && profile.user._id.equals(req.user._id)) {
                res.render('pages/personal_profile.ejs', {
                    email: req.user.email, user: profile.user, nickname: req.user.nickname,
                    projects: profile.projects, date: formatDate
                })
            } else {
                res.render('pages/profile.ejs', {
                    email: email, user: profile.user, nickname: nickname,
                    projects: profile.projects, date: formatDate
                })
            }
        } catch (e) {
            next(e)
        }
    }

    async profileSettings(req, res, next) {
        try {
            let email, nickname
            if (req.user != null) {
                email = req.user.email
                nickname = req.user.nickname
            }
            const user = await User.findOne({nickname: req.params.id})
            if (user == null) return next(ApiError.NotExist())
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