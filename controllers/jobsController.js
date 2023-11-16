const Job = require('../models/jobs');
const apiResponse = require("../helpers/apiResponse");


class JobsController {
    constructor(jobModel) {
        this.Job = jobModel;
    }

    // Get all Jobs  =>  /api/v1/jobs  
    getJobs = async (req, res, next) => {
        try {
            const jobs = await Job.find();
            // Uncomment the line below if you want to intentionally throw an error for testing
            // throw new Error('This is a custom error message');
            return apiResponse.successResponseWithData(res, 'Operation success', jobs);
        } catch (error) {
            // Pass the error to the next middleware
            next(error);
        }
    };

    // Get a single job with id and slug   =>  /api/v1/job/:id/:slug
    getJob = async (req, res, next) => {
        try {
            Job.findOne({ _id: req.params.id, slug: req.params.slug }, "_id title description email lastDate").then((job) => {
                if (job !== null) {
                    return apiResponse.successResponseWithData(res, "Operation success", job);
                } else {
                    return apiResponse.successResponseWithData(res, "Job not found", {});
                }
            });
        } catch (error) {
            // Pass the error to the next middleware
            next(error);
        }
    };


    // Get all Jobs  =>  /api/v1/jobs
    newJob = async (req, res, next) => {
        try {
            let job = {};
            await Job.create(req.body)
                .then(res => job = res)
                .catch(err => console.log('Error occured while saving data', err));

            return apiResponse.successResponseWithData(res, "Job Created!", job);
        } catch (error) {
            // Pass the error to the next middleware
            next(error);
        }
    };

    // Update a Job  =>  /api/v1/job/:id
    updateJob = async (req, res, next) => {
        try {
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

            return apiResponse.successResponseWithData(res, "Job updated!", job);
        } catch (error) {
            // Pass the error to the next middleware
            next(error);
        }
    };

    // Update a Job  =>  /api/v1/job/:id
    deleteJob = async (req, res, next) => {
        try {
            let job = await Job.findById(req.params.id);

            if (!job) {
                res.status(404).json({
                    success: true,
                    message: 'Job not found'
                });
            }

            job = await Job.findByIdAndDelete(req.params.id);

            return apiResponse.successResponse(res, "Job deleted!");
        } catch (error) {
            // Pass the error to the next middleware
            next(error);
        }
    };
}


module.exports = new JobsController();