const { body, query, validationResult } = require('express-validator');

// Helper middleware to handle the validation result
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validation rules for adding a school
const addSchoolValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name must not be empty')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: 255 })
    .withMessage('Name must be less than 255 characters'),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address must not be empty')
    .isString()
    .withMessage('Address must be a string')
    .isLength({ max: 500 })
    .withMessage('Address must be less than 500 characters'),

  body('latitude')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a valid number between -90 and 90')
    .toFloat(),

  body('longitude')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a valid number between -180 and 180')
    .toFloat(),

  validateResult,
];

// Validation rules for listing schools
const listSchoolsValidation = [
  query('latitude')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a valid number between -90 and 90')
    .toFloat(),

  query('longitude')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a valid number between -180 and 180')
    .toFloat(),

  validateResult,
];

module.exports = {
  addSchoolValidation,
  listSchoolsValidation,
};
