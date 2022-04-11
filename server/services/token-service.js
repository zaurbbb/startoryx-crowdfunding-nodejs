const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')

class TokenService{
    // create access and refresh tokens
    generateTokens(payload, accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'})){
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    // validity check of access token
    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        }
        catch (e) {
            return null
        }
    }
    // validity check of refresh token
    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        }
        catch (e) {
            return null

        }
    }

    // save token to database
    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        return token
    }

    // remove token from database
    async removeToken(refreshToken){
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData
    }

    // find token in database
    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData
    }
}

module.exports = new TokenService()