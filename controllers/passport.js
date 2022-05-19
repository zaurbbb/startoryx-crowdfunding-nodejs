const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user-model')
const userService = require('../services/user-service')

module.exports = function (passport, req, res) {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            done(err, user)
        })
    })

    passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const userData = await userService.login(username, password, done)
                console.log(userData)
            } catch (e) {
                console.log(e)
            }
        }
    ));

    passport.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.CLIENT_UNT + "/api/google/callback"
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = (profile.email == null) ? profile.emails[0].value : profile.email
                    const userData = await userService.googleAuth(profile.id, profile.name.givenName,
                        profile.name.familyName, email, email.split('@')[0], profile.photos[0].value, done)
                    console.log(userData)
                } catch (e) {
                    console.log(e)
                }
            })
    );
}