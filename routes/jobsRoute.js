const express = require('express');
const router = express.Router();
const dataController = require('../controllers/jobsController');


router.route('/jobs').get(dataController.getJobs);
router.route('/job/:id/:slug').get(dataController.getJob);
router.route('/job/new').post(dataController.newJob);
router.route('/job/:id')
                        .put(dataController.updateJob)
                        .delete(dataController.deleteJob);
module.exports = router;