const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(email, password, first_name = null, last_name = null, phone = null, age = null
        , googleId = null) {
        // check: if such a user is in the database
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest('User with this email address already exists')
        }

        const hashPassword = await bcrypt.hash(password, 4) // hash the password
        const activationLink = uuid.v4()
        const user = await UserModel.create({
            email,
            password: hashPassword,
            googleId,
            first_name,
            last_name,
            phone,
            age,
            activationLink,
            roles: ["USER"]
        }) // save user to database
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`) // sending an activation email
        const userDto = new UserDto(user) // (data to transfer) id, email, isActivated, roles

        return {user: userDto}
    }

    async googleAuth(googleId, first_name, last_name, email, done) {
        let user = await UserModel.findOne({googleId: googleId});
        if (user) {
            done(null, user)
        }
        else {
            user = await UserModel.create({googleId, first_name, last_name, email: "", roles: ["USER"], isActivated: true})
            done(null, user)
        }
        const userDto = new UserDto(user)

        return {user: userDto}

    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Incorrect activation link')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password, done) {
        const user = await UserModel.findOne({email})
        if (!user) {
            done(null, false)
            throw ApiError.BadRequest('User with this email address already exists')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            done(null, false)
            throw ApiError.BadRequest('Wrong password')
        }
        const userDto = new UserDto(user)

        done(null, user)

        return {user: userDto}
    }

    async getAllUsers() {
        return UserModel.find();
    }

}

module.exports = new UserService()