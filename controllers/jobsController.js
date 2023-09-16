const Job = require('../models/jobs');

// Get all Jobs  =>  /api/v1/jobs
exports.getJobs = (req, res, next) => {

    res.status(200).json({
        success: true,
        message: 'this route will get all jobs in future'
    });
};

// Get all Jobs  =>  /api/v1/jobs
exports.newJob = async (req, res, next) => {
    let job = {};
    await Job.create(req.body)
        .then(res => job = res)
        .catch(err => console.log('Error occured while saving data', err));

    res.status(200).json({
        success: true,
        message: 'Job Created!',
        data: job
    });
};