const Joi = require('joi');

const createTraveler = {
  body: Joi
    .object()
    .keys({
      NationalId: Joi.string().regex(/^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/).messages({
        'string.pattern.base': `National Id must have 14 digits.`
      }).required(),
      city: Joi.string().required().max(20),
      government: Joi.string().required().max(20),
      StudentUniversityId: Joi.object(),
      CollegeEnrollmentStatement: Joi.object(),
      EmployeeCompanyId: Joi.object(),
      NationalIdCard: Joi.object()
    }),

};

const updateTraveler = {
  NationalId: Joi.string().regex(/^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/).messages({
    'string.pattern.base': `National Id must have 14 digits.`
  }).required(),
  city: Joi.string().required().max(20),
  government: Joi.string().required().max(20),
  StudentUniversityId: Joi.object(),
  CollegeEnrollmentStatement: Joi.object(),
  EmployeeCompanyId: Joi.object(),
  NationalIdCard: Joi.object(),
};


module.exports = {
  createTraveler,
  updateTraveler,
};
