const Project = require('../models/project-model')

module.exports = async (id) => {
    const project = await Project.findById(id).populate('rates')
    let avRate = 0
    project.rates.forEach(function (oneRate) {
        avRate += oneRate.rate
    })
    return avRate / project.rates.length;
}