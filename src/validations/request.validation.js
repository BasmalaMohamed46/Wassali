const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRequest = {
    body: Joi.object().keys({
        state: Joi.string().required().valid('processing', 'confirmed', 'accepted', 'pickedup', 'onmyway', 'delivered').default('processing'),
        rate: Joi.number().required(),
        reward: Joi.number().required(),
        qrCode: Joi.string().required(),
        userId: Joi.string().custom(objectId),
        traveler: Joi.string().custom(objectId),
        package: Joi.string().custom(objectId),
        trip: Joi.string().custom(objectId),
    }),
};

const getRequests = {
    query: Joi.object().keys({
        user: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getRequest = {
    params: Joi.object().keys({
        requestId: Joi.string().custom(objectId),
    }),
};

const updateRequest = {
    params: Joi.object().keys({
        requestId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            state: Joi.string().valid('processing', 'confirmed', 'accepted', 'pickedup', 'onmyway', 'delivered').default('processing'),
            rate: Joi.number(),
            reward: Joi.number(),
            qrCode : Joi.string(),
            userId: Joi.string().custom(objectId),
            traveler: Joi.string().custom(objectId),
            package: Joi.string().custom(objectId),
            trip: Joi.string().custom(objectId),
        })
        .min(1),
};

const deleteRequest = {
    params: Joi.object().keys({
        requestId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createRequest,
    getRequests,
    getRequest,
    updateRequest,
    deleteRequest,
};
