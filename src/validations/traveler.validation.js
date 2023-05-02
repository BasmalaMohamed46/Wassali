const Joi = require('joi');

const createTraveler = {
  body: Joi
    .object()
    .keys({
      NationalId: Joi.string().trim().replace(/'/g, '').regex(/^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/).messages({
        'string.pattern.base': `National Id must have 14 digits.`
      }).required(),
      StudentUniversityId: Joi.object(),
      CollegeEnrollmentStatement: Joi.object(),
      EmployeeCompanyId: Joi.object(),
      NationalIdCard: Joi.object()
    }),

};

const updateTraveler = {
  body: Joi
    .object()
    .keys({
      name: Joi.string().max(128),
      city: Joi.string(),
      governorate: Joi.string(),
      birthDate:Joi
      .date()
      .max('01-01-2003')
      .iso()
      .messages({
        'date.format': `Date format is YYYY-MM-DD`,
        'date.max': `Age must be 18+`
      }),
      address:Joi.string,

    }),
};


module.exports = {
  createTraveler,
  updateTraveler,
};
