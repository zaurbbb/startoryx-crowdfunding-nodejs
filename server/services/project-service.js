class ProjectService{
    async ascendingByTitle(projects){
        return await projects.sort(function(obj1, obj2) {
            if (obj1.title < obj2.title) return -1;
            if (obj1.title > obj2.title) return 1;
            return 0;
        })
    }
    async decreasingByTitle(projects){
        return await projects.sort(function(obj1, obj2) {
            if (obj1.title > obj2.title) return -1;
            if (obj1.title < obj2.title) return 1;
            return 0;
        })
    }
    async ascendingByDate(projects){
        return await projects.sort(function(obj1, obj2) {
            if (obj1.dateCreated < obj2.dateCreated) return -1;
            if (obj1.dateCreated > obj2.dateCreated) return 1;
            return 0;
        })
    }
    async decreasingByDate(projects){
        return await projects.sort(function(obj1, obj2) {
            if (obj1.dateCreated > obj2.dateCreated) return -1;
            if (obj1.dateCreated < obj2.dateCreated) return 1;
            return 0;
        })
    }
}

module.exports = new ProjectService()