const Project = require("../models/project-model");
const projectController = require("./project-controller");
const formatDate = require("../helpers/formatDate");


class ViewController{
    async dashboard(req, res, next){
        try{
            let search = null
            let projects
            if (req._parsedUrl.query != null) {
                const str = req._parsedUrl.query
                search = str.split('=',2)[1]
                projects = await Project.find({$text: {$search: search}}).lean()
            } else {
                projects = await Project.find().lean()
            }
            const sortedProjects = await projectController.ProjectSort(projects, parseInt(req.params.sort) || 0)
            let email = null
            let searchUrl = "search="
            if (req._parsedUrl.query != null) searchUrl = req._parsedUrl.query
            if (req.user != null) email = req.user.email
            res.render('pages/dashboard.ejs', {email: email, date: formatDate, projects: sortedProjects, search: searchUrl})
        }
        catch (e) {
            next(e)
        }
    }
}

module.exports = new ViewController()