module.exports = class ProfileDto{
    projects;
    user;

    constructor(projects, user) {
        this.projects = projects;
        this.user = user;
    }
}