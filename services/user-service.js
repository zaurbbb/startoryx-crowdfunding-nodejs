const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const UserDto = require('../dtos/user-dto')
const User = require("../models/user-model");
const Project = require("../models/project-model");

class UserService {
    async registration(email, nickname, password, first_name = null, last_name = null, phone = null, age = null
        , googleId = null) {

        const hashPassword = await bcrypt.hash(password, 4)
        const activationLink = uuid.v4()
        const user = await UserModel.create({
            email,
            nickname,
            password: hashPassword,
            googleId,
            first_name,
            last_name,
            phone,
            age,
            activationLink,
            roles: ["USER"]
        })
        await mailService.sendActivationMail(email, `${process.env.URL}/activate/${activationLink}`)
        const userDto = new UserDto(user)

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
        if (!user) return

        const resetLink = uuid.v4()
        await UserModel.findOneAndUpdate({email: user.email}, {resetLink: resetLink})
        await mailService.sendResetLink(user.email, `${process.env.URL}/reset/${resetLink}`)
    }

    async activationMail(id) {
        const user = await UserModel.findOne({_id: id})
        const activationLink = user.activationLink
        await mailService.sendActivationMail(user.email, `${process.env.URL}/activate/${activationLink}`)
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        user.isActivated = true;
        await user.save();
    }

    async login(email, password, done) {
        const user = await UserModel.findOne({email})
        if (!user) {
            done(null, false)
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            done(null, false)
        }
        const userDto = new UserDto(user)

        done(null, user)
        return {user: userDto}
    }

    async updatePassword(resetLink, password) {
        const hashPassword = await bcrypt.hash(password, 4)
        await User.findOneAndUpdate({resetLink: resetLink}, {password: hashPassword, resetLink: null})
    }

    async updateProfile(email, nickname, age, phone, specialist) {
        await User.findOneAndUpdate(
            {email: email},
            {
                nickname,
                specialist,
                age,
                phone
            }
        )
    }

    async donate(userId, projectId, amount) {
        const user = await User.findOne({_id: userId})
        const project = await Project.findOne({_id: projectId})

        await Project.findOneAndUpdate({_id: projectId}, {collected: project.collected + parseInt(amount)})
        await User.findOneAndUpdate({_id: userId}, {balance: user.balance - parseInt(amount)})
    }

    async personal(id, first_name, last_name, nickname, phone, age, specialist) {
        await User.findOneAndUpdate({_id: id}, {
            first_name,
            last_name,
            nickname,
            phone,
            age,
            specialist
        })
    }
}

module.exports = new UserService()