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
            if (obj1.dateCreated > obj2.dateCreated) return -1;
            if (obj1.dateCreated < obj2.dateCreated) return 1;
            return 0;
        })
    }
    async decreasingByDate(projects){
        return await projects.sort(function(obj1, obj2) {
            if (obj1.dateCreated < obj2.dateCreated) return -1;
            if (obj1.dateCreated > obj2.dateCreated) return 1;
            return 0;
        })
    }
    async ascendingByRate(projects){
        return await projects.sort(function(obj1, obj2) {
            const avrRate1 = obj1.rate.reduce((a, b) => parseInt(a) + parseInt(b), 0) / obj1.rate.length
            const avrRate2 = obj2.rate.reduce((a, b) => parseInt(a) + parseInt(b), 0) / obj2.rate.length

            if (avrRate1 > avrRate2) return -1;
            if (avrRate1 < avrRate2) return 1;
            return 0;
        })
    }
}

module.exports = new ProjectService()