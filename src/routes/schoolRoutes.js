const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { addSchoolValidation, listSchoolsValidation } = require('../middleware/validation');

// Route to add a school
router.post('/addSchool', addSchoolValidation, schoolController.addSchool);

// Route to list schools sorted by proximity
router.get('/listSchools', listSchoolsValidation, schoolController.listSchools);

module.exports = router;
