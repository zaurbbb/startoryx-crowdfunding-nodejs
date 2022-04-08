const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(email, password, first_name = null, last_name = null, phone = null, age = null) {
        // check: if such a user is in the database
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest('User with this email address already exists')
        }

        const hashPassword = await bcrypt.hash(password, 4) // hash the password
        const activationLink = uuid.v4()
        const user = await UserModel.create({email, password: hashPassword, first_name, last_name, phone, age, activationLink, roles: ["USER"]}) // save user to database
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`) // sending an activation email
        const userDto = new UserDto(user) // (data to transfer) id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto}) // token generation
        await tokenService.saveToken(userDto.id, tokens.refreshToken) // saving the token

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Incorrect activation link')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if(!user){
            throw ApiError.BadRequest('User with this email address already exists')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Wrong password')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken) // saving the token

        return {...tokens, user: userDto}
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken){
        if (!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken) // saving the token

        return {...tokens, user: userDto}
    }

    async getAllUsers(){
        const users = await UserModel.find()
        return users
    }

}

module.exports = new UserService()