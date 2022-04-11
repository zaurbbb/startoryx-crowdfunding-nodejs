const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/user-model')
const userService = require('../services/user-service')

module.exports = function (passport, req, res){
    passport.serializeUser((user, done) =>{
        done(null, user.id)
    })
    passport.deserializeUser((id, done) =>{
        User.findById(id, function (err, user){
            done(err, user)
        })
    })

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/google/callback"
    },
        // TODO: Rewrite to user-controller
        async(accessToken, refreshToken, profile, email, done)=>{
            User.findOne({googleId: profile.id}).then((currentUser) => {
                if (currentUser){
                    // console.log(email)
                    // console.log(profile)
                    done(null, currentUser)
                }
                else {
                    // console.log(email)
                    userService.registrationByGoogle(profile.id, profile.name.givenName,
                        profile.name.familyName, email, accessToken)
                        .then((newUser)=>{
                        done(null, newUser)
                    });
                }
            })
        })
    )
}