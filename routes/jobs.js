const express = require('express');
const router = express.Router();



// Importing jobs controller methods
const { 
    getJobs,
    getJob,
    newJob,
    updateJob,
    deleteJob
} = require('../controllers/jobsController');


router.route('/jobs').get(getJobs);
router.route('/job/:id/:slug').get(getJob);
router.route('/job/new').post(newJob);
router.route('/job/:id')
                        .put(updateJob)
                        .delete(deleteJob);
module.exports = router;