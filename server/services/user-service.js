const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')
const User = require("../models/user-model");

class UserService {
    async registration(email, nickname, password, first_name = null, last_name = null, phone = null, age = null
        , googleId = null, image = null) {
        // check: if such a user is in the database
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest('User with this email address already exists')
        }

        const hashPassword = await bcrypt.hash(password, 4) // hash the password
        const activationLink = uuid.v4()
        const user = await UserModel.create({
            email,
            nickname,
            password: hashPassword,
            googleId,
            image,
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

    async googleAuth(googleId, first_name, last_name, email, nickname, image = null, done) {
        let user = await UserModel.findOne({googleId: googleId});
        if (user) {
            done(null, user)
        } else {
            user = await UserModel.create({
                googleId,
                image,
                first_name,
                last_name,
                email,
                nickname,
                roles: ["USER"],
                isActivated: true
            })
            done(null, user)
        }
        const userDto = new UserDto(user)

        return {user: userDto}

    }

    async passwordReset(id, email) {
        let user
        if (id != null)
            user = await UserModel.findOne({_id: id})
        else
            user = await UserModel.findOne({email: email})
        if (!user) {
            throw ApiError.BadRequest('User with this email address already exists')
        }

        const resetLink = uuid.v4()
        await UserModel.findOneAndUpdate({email: user.email}, {resetLink: resetLink})
        await mailService.sendResetLink(user.email, `${process.env.API_URL}/api/reset/${resetLink}`)
    }

    async activationMail(id) {
        const user = await UserModel.findOne({_id: id})
        const activationLink = user.activationLink
        await mailService.sendActivationMail(user.email, `${process.env.API_URL}/api/activate/${activationLink}`)
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Incorrect activation link')
        }
        user.isActivated = true;
        await user.save();
    }

    async reset(resetLink) {
        const user = await UserModel.findOne({resetLink})
        if (!user) {
            throw ApiError.BadRequest('Incorrect reset link')
        }
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

    async updatePassword(resetLink, password){
        const hashPassword = await bcrypt.hash(password, 4)
        await User.findOneAndUpdate({resetLink: resetLink}, {password: hashPassword, resetLink: null})
    }

    async updateProfile(email, nickname, first_name, last_name, age, phone = null){
        await User.findOneAndUpdate(
            {email: email},
            {nickname: nickname, first_name: first_name, last_name: last_name,
            age: age, phone: phone}
        )
    }

}

module.exports = new UserService()