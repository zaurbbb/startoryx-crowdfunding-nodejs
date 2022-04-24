const projectService = require("../services/project-service")

class ProjectController{
    async ProjectSort(projects, sort = 0) {
        try {
            switch (sort){
                case 0: return projects
                case 1: return await projectService.ascendingByTitle(projects)
                case 2: return await projectService.decreasingByTitle(projects)
                case 3: return await projectService.ascendingByDate(projects)
                case 4: return await projectService.decreasingByDate(projects)
            }
        }
        catch (e) {
            console.log(e)
        }
    }
}

module.exports = new ProjectController()