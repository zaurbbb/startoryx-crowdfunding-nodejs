const cron = require('node-cron')
const Project = require('../models/project-model')

module.exports =
    cron.schedule('* 59 23 * * *', async () => {
        const projects = await Project.find()
        for (const project of projects) {
            console.log(project.days)
            await Project.findOneAndUpdate({
                _id: project._id
            }, {
                $set: {days: project.days - 1}
            })
            console.log(project.days)
        }
        console.log("DAYS UPDATE: On all projects, the 'days' field has been reduced by 1")
    })