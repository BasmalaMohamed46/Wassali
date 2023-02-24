const Joi = require('joi');

const createTraveler = {
  body: Joi
    .object()
    .keys({
      NationalId: Joi.string().regex(/^[1-3](19|20)\d{2}[7-8]\d{7}[0-9]\d{2}$/).messages({
        'string.pattern.base': `National Id must have 16 digits.`
      }).required(),
      birthdate: Joi
        .date()
        .max('01-01-2003')
        .iso()
        .messages({
          'date.format': `Date format is YYYY-MM-DD`,
          'date.max': `Age must be 18+`
        }).required(),
      city: Joi.string().required().max(20),
      government: Joi.string().required().max(20),
    }),
  StudentUniversityId: Joi.string(),
  CollegeEnrollmentStatement: Joi.string(),
  EmployeeCompanyId: Joi.string(),

};

const updateTraveler = {
  NationalId: Joi.string().regex(/^[1-3](19|20)\d{2}[7-8]\d{7}[0-9]\d{2}$/).messages({
    'string.pattern.base': `National Id must have 16 digits.`
  }).required(),
  birthdate: Joi
    .date()
    .max('01-01-2003')
    .iso()
    .messages({
      'date.format': `Date format is YYYY-MM-DD`,
      'date.max': `Age must be 18+`
    }).required(),
  city: Joi.string().required().max(20),
  government: Joi.string().required().max(20),
  StudentUniversityId: Joi.string(),
  CollegeEnrollmentStatement: Joi.string(),
  EmployeeCompanyId: Joi.string(),
};


module.exports = {
  createTraveler,
  updateTraveler,
};
