const Project = require("../models/project-model");
const User = require("../models/user-model")
const Definition = require('../models/definition-model')
const Payment = require('../models/payment-model')
const Miscellaneous = require('../models/miscellaneous-model')
const viewService = require('../services/view-service')
const formatDate = require("../helpers/formatDate");

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
                nickname: nickname, url: process.env.URL
            })
        } catch (e) {
            next(e)
        }
    }

    async faq(req, res, next) {
        try {
            const definitions = await Definition.find()
            const payments = await Payment.find()
            const miscellaneous = await Miscellaneous.find()
            res.render('pages/faq', {defs: definitions, pays: payments, misc: miscellaneous})
        } catch (e) {
            next(e)
        }
    }

    async error_page(req, res, next) {
        try {
            res.render('pages/404', {isError: false, message: "Sorry, the page you’re looking for doesn’t exist."})
        } catch (e) {
            next(e)
        }
    }

    async registration(req, res, next) {
        try {
            if (req.user != null) return res.redirect('/profile')
            res.render('pages/registration')
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            if (req.user != null) return res.redirect('/profile')
            res.render('pages/login')
        } catch (e) {
            next(e)
        }
    }

    async forget(req, res, next) {
        try {
            res.render('pages/forget')
        } catch (e) {
            next(e)
        }
    }

    async getProject(req, res, next) {
        try {
            const count = await Project.count()
            const rand = Math.floor(Math.random() * count)
            const randProject = await Project.findOne().skip(rand)
            const project = await Project.findById(req.params.id).populate({
                path: 'comments', model: 'Comment',
                populate: {path: 'user', model: 'User'}
            }).populate('user')
            const userProjects = await Project.count({user: project.user})
            if (req.user != null) {
                await Project.findOneAndUpdate({_id: req.params.id}, {visits: project.visits + 1})
            }
            res.render('projects/read', {
                date: formatDate, project: project, randProject: randProject,
                userProjects: userProjects
            })
        } catch (e) {
            next(e)
        }
    }

    async getComments(req, res, next) {
        try {
            const project = await Project.findById(req.params.id).populate({
                path: 'comments', model: 'Comment',
                populate: {path: 'user', model: 'User'}
            }).populate('user')
            const userProjects = await Project.count({user: project.user})
            if (req.user != null) {
                await Project.findOneAndUpdate({_id: req.params.id}, {visits: project.visits + 1})
            }
            res.render('projects/comments', {
                date: formatDate, project: project,
                userProjects: userProjects
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
            res.redirect('/profile')
        } catch (e) {
            next(e)
        }
    }

    async getEditProject(req, res, next) {
        try {
            const project = await Project.findById(req.params.id).lean()
            if (project.user.equals(req.user._id))
                res.render('projects/edit', {project: project})
            else
                res.redirect('/profile')
        } catch (e) {
            next(e)
        }
    }

    async postProject(req, res, next) {
        try {
            req.body.user = req.user._id
            if (req.file != null) req.body.image = req.file.path
            await Project.create(req.body)
            res.redirect('/profile')
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
            let isOwner = false
            if (req.user == null)
                return res.redirect('/login')
            if (req.params.id == null)
                req.params.id = req.user.nickname
            if (req.params.id === req.user.nickname)
                isOwner = true

            const profile = await viewService.profile(req.params.id)

            if ((isOwner) && (profile.user.age == null || profile.user.phone == null || profile.user.specialist == null))
                return res.render('pages/personal_reg',
                    {user: profile.user})
            res.render('pages/profile', {
                user: profile.user, isOwner: isOwner,
                projects: profile.projects, date: formatDate
            })

        } catch (e) {
            next(e)
        }
    }

    async profileSettings(req, res, next) {
        try {
            if (req.user == null)
                return res.redirect('/api/dashboard')
            const user = await User.findOne({_id: req.params.id})

            res.render('pages/settings', {
                user: user,
                date: formatDate
            })
        } catch (e) {
            next(e)
        }
    }

    async personal(req, res, next) {
        try {
            const user = await User.findOne({_id: req.user._id})
            res.render('pages/personal_reg', {user: user})
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ViewController()