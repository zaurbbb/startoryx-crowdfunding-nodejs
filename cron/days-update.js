const cron = require('node-cron')
const Project = require('../models/project-model')

module.exports =
    cron.schedule('00 00 1 * * *', async () => {
        const projects = await Project.find()
        for (const project of projects) {
            await Project.findOneAndUpdate(
                {_id: project._id},
                {$set: {days: project.days - 1}
            })
            if (project.days <= 0) {
                await Project.findOneAndUpdate(
                    {_id: project._id},
                    {$set: {published: false}
                    })
            }
        }
        console.log("DAYS UPDATE: On all projects, the 'days' field has been reduced by 1.")
    })