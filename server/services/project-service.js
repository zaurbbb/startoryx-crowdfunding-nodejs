class ProjectService{
    async sortByTitle(projects){
        return await projects.sort(function(obj1, obj2) {
            if (obj1.title < obj2.title) return -1;
            if (obj1.title > obj2.title) return 1;
            return 0;
        })
    }
}

module.exports = new ProjectService()