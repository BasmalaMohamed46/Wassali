const Joi = require('joi');

const createTrip = {
  body: Joi
    .object()
    .keys({
      from: Joi.string().required(),
      to: Joi.string().required(),
      TripDate: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000).iso().messages({
        'date.format': `Date format is YYYY-MM-DD`,
        'date.min': `Date should not be passed`
      }).required(),
      TripTime: Joi.string().required(),
      AvailableWeight: Joi.number().required(),
      unAcceptablaPackage: Joi.string().required(),
      Traveler: Joi.string(),
    })
};

const updateTrip = {
  body: Joi
    .object()
    .keys({
      from: Joi.string().optional().allow(''),

      to: Joi.string().optional().allow(''),
      TripDate: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000).iso().messages({
        'date.format': `Date format is YYYY-MM-DD`,
        'date.min': `Date should not be passed`
      }).optional().allow(''),
      TripTime: Joi.string().optional().allow(''),
      AvailableWeight: Joi.number().optional().allow(''),
      unAcceptablaPackage: Joi.string().optional().allow(''),
      Traveler: Joi.string(),
    })


};


module.exports = {
  createTrip,
  updateTrip
};
