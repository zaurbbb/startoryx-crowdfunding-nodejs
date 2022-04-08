// data transfer object from user
module.exports = class UserDto{
    id;
    email;
    first_name;
    last_name;
    phone;
    age;
    isActivated;
    roles;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.roles = model.roles;
        this.first_name = model.first_name;
        this.last_name = model.last_name;
        this.phone = model.phone;
        this.age = model.age;
    }
}