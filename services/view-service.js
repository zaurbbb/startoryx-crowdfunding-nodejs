const Project = require("../models/project-model");
const projectController = require("../controllers/project-controller");
const ProjectDto = require('../dtos/project-dto')
const ProfileDto = require('../dtos/profile-dto')
const Comment = require("../models/comment-model");
const Rate = require("../models/rate-model");
const averageRate = require("../helpers/averageRate");
const User = require("../models/user-model");
const ApiError = require("../exceptions/api-error");

class ViewService{
    async projectBoard(query, sort){
        let search, projects

        if (query === "search=")
            query = null
        if (query != null) {
            search = query.split('=', 2)[1]
            projects = await Project.find({published: true, $text: {$search: search}}).lean()
        } else
            projects = await Project.find({published: true}).lean()

        const sortedProjects = await projectController.ProjectSort(projects, parseInt(sort) || 0)

        let searchUrl = "search="
        if (query != null) searchUrl = query
        return new ProjectDto(sortedProjects, searchUrl)
    }
    async postComment(body){
        const comment = await Comment.create(body)
        await Project.findOneAndUpdate(
            {_id: body.project},
            {$push: {comments: comment}})
    }
    async postRate(body){
        const rate = await Rate.create(body)
        await Project.findOneAndUpdate(
            {_id: body.project},
            {$push: {rates: rate}})

        await Project.findOneAndUpdate({
            _id: body.project
        }, {
            avgRate: await averageRate(body.project)
        })
    }
    async profile(nickname){
        const user = await User.findOne({nickname: nickname})
        let projects = await Project.find({user: user._id}).lean()
        return new ProfileDto(projects, user)
    }
}

module.exports = new ViewService()