module.exports = class ApiError extends Error{
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(){
        return new ApiError(401, "User is not authorized")
    }

    static RatedError(){
        return new ApiError(403, "You have already rated this project")
    }

    static BadRequest(message, errors = []){
        return new ApiError(400, message, errors)
    }

    static NoAccess(){
        return new ApiError(403, "You don't have access")
    }
}