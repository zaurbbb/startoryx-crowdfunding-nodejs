const projectService = require("../services/project-service")

class ProjectController{
    async ProjectSort(projects, sort = 0) {
        try {
            switch (sort){
                case 0: return projects
                case 1: return await projectService.sortByTitle(projects)
            }
        }
        catch (e) {
            console.log(e)
        }
    }
}

module.exports = new ProjectController()