// data transfer object from user
module.exports = class UserDto{
    id;
    email;
    isActivated;
    roles;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.roles = model.roles;
    }
}