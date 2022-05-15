const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user-model')
const Project = require('../models/project-model')
const Comment = require('../models/comment-model')
const Rate = require('../models/rate-model')
const userResource = require('../admin/resources/user-resource')
const projectResource = require('../admin/resources/project-resource')
const commentResource = require('../admin/resources/comment-resource')
const rateResource = require('../admin/resources/rate-resource')
const panelLocale = require('../admin/resources/panel-locale')

const mongoose = require('mongoose')

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
    databases: [mongoose],
    ...panelLocale,
    branding: {
        companyName: 'Startoryx',
        softwareBrothers: false,
        logo: '',
    },
    resources: [{
        resource: User,
        options: {
            ...userResource
        },
    },
        {
            resource: Project,
            options: {
                ...projectResource
            }
        },
        {
            resource: Comment,
            options: {
                ...commentResource
            }
        },
        {
            resource: Rate,
            options: {
                ...rateResource
            }
        }
    ]
})

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        try {
            const user = await User.findOne({email})
            console.log(user.roles)
            let hasRole = false
            user.roles.forEach(role => {
                if ("ADMIN".includes(role))
                    hasRole = true
            })
            if (!hasRole) return false
            if (user) {
                const matched = await bcrypt.compare(password, user.password)
                if (matched) return user
            }
            return false
        } catch (e) {
            console.log(e)
        }
    }
})

module.exports = router

