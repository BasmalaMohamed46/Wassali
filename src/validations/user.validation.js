const Joi = require('joi');
const { password, objectId, phoneNumber } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    phoneNumber: Joi.string().required().custom(phoneNumber),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    birthDate: Joi.date().required(),
    role: Joi.string().valid('user', 'admin'),
    city: Joi.string().required(),
    goverment: Joi.string().required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      phoneNumber: Joi.string().custom(phoneNumber),
      password: Joi.string().custom(password),
      name: Joi.string(),
      birthdate: Joi.date().required(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
