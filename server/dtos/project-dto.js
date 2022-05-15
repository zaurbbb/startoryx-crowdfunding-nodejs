module.exports = class ProjectDto{
    projects;
    search;

    constructor(projects, search) {
        this.projects = projects;
        this.search = search;
    }
}