const sortingService = require("../services/sorting-service")

class ProjectController{
    async ProjectSort(projects, sort = 0) {
        try {
            switch (sort){
                case 0: return projects
                case 1: return await sortingService.ascendingByTitle(projects)
                case 2: return await sortingService.decreasingByTitle(projects)
                case 3: return await sortingService.ascendingByDate(projects)
                case 4: return await sortingService.decreasingByDate(projects)
                case 5: return await sortingService.ascendingByRate(projects)
            }
        }
        catch (e) {
            console.log(e)
        }
    }
}

module.exports = new ProjectController()