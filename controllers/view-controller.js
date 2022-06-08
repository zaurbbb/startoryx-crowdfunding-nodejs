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
            res.render('pages/faq.ejs', {defs: definitions, pays: payments, misc: miscellaneous})
        }
        catch (e) {
            next(e)
        }
    }
    async registration(req, res, next) {
        try {
            if (req.user != null) return res.redirect('/profile')
            res.render('pages/registration')
        }
        catch (e) {
            next(e)
        }
    }
    async login(req, res, next) {
        try {
            if (req.user != null) return res.redirect('/profile')
            res.render('pages/login')
        }
        catch (e) {
            next(e)
        }
    }
    async forget(req, res, next) {
        try {
            res.render('pages/forget')
        }
        catch (e) {
            next(e)
        }
    }
    async getProject(req, res, next) {
        try {
            let email, nickname
            const project = await Project.findById(req.params.id).populate({
                path: 'comments', model: 'Comment',
                populate: {path: 'user', model: 'User'}
            }).populate('user')
            if (req.user != null) {
                email = req.user.email
                nickname = req.user.nickname
                await Project.findOneAndUpdate({_id: req.params.id}, {visits: project.visits + 1})
            }
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
            let isOwner = false
            if (req.user == null)
                return res.redirect('/login')
            if (req.params.id == null)
                req.params.id = req.user.nickname
            if (req.params.id === req.user.nickname)
                isOwner = true

            const profile = await viewService.profile(req.params.id)
            res.render('pages/profile', {
                user: profile.user, isOwner: isOwner,
                projects: profile.projects, date: formatDate, url: process.env.URL
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
}

module.exports = new ViewController()