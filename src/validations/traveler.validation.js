const Joi = require('joi');

const createTraveler = {
  body: Joi
    .object()
    .keys({
      NationalId: Joi.string().regex(/^[1-3](19|20)\d{2}[7-8]\d{7}[0-9]\d{2}$/).messages({
        'string.pattern.base': `National Id must have 16 digits.`
      }).required(),
      city: Joi.string().max(20).required(),
      government: Joi.string().max(20).required(),
      StudentUniversityId: Joi.string(),
      CollegeEnrollmentStatement: Joi.string(),
      EmployeeCompanyId: Joi.string(),
      NationalIdCard: Joi.string(),
    }),

};

const updateTraveler = {
  NationalId: Joi.string().regex(/^[1-3](19|20)\d{2}[7-8]\d{7}[0-9]\d{2}$/).messages({
    'string.pattern.base': `National Id must have 16 digits.`
  }).required(),
  city: Joi.string().required().max(20),
  government: Joi.string().required().max(20),
  StudentUniversityId: Joi.string(),
  CollegeEnrollmentStatement: Joi.string(),
  EmployeeCompanyId: Joi.string(),
  NationalIdCard: Joi.string(),
};


module.exports = {
  createTraveler,
  updateTraveler,
};
