// Get all Jobs  =>  /api/v1/jobs
exports.getJobs = (req, res, next) => {  

    res.status(200).json({
        success: true,
        results: 'this route will get all jobs in future'
    });
};