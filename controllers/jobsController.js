const Job = require('../models/jobs');

// Get all Jobs  =>  /api/v1/jobs
exports.getJobs = async (req, res, next) => {

    const jobs = await Job.find();

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
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

// Update a Job  =>  /api/v1/job/:id
exports.updateJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404).json({
            success: true,
            message: 'Job not found'
        });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: 'Job is updated.',
        data: job
    });
};

// Update a Job  =>  /api/v1/job/:id
exports.deleteJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404).json({
            success: true,
            message: 'Job not found'
        });
    }

    job = await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Job is deleted.'
    });
};