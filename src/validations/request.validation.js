const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRequest = {
    body: Joi.object().keys({
        state: Joi.string().valid('processing', 'confirmed', 'accepted', 'pickedup', 'onmyway', 'delivered').default('processing'),
        rate: Joi.number(),
        reward: Joi.number(),
        qrCode: Joi.string(),
        userId: Joi.string().custom(objectId),
        // traveler: Joi.string().custom(objectId),
        trip: Joi.string().custom(objectId),
        to: Joi.string().required(),
        from: Joi.string().required(),
        item: Joi.string().required(),
        weight: Joi.number().required(),
        location: Joi.string().required(),
        targetLocation: Joi.string().required(),
        anotherPhone:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}),
        category: Joi.string().required(),
        buyOrdeliver: Joi.string().required().valid('buy', 'deliver').default('buy'),
        date: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000).iso().messages({
            'date.format': `Date format is YYYY-MM-DD`,
            'date.min': `Date should not be passed`
          }).required(),

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
            qrCode: Joi.string(),
            userId: Joi.string().custom(objectId),
            // traveler: Joi.string().custom(objectId),
            trip: Joi.string().custom(objectId),
            to: Joi.string().required(),
            from: Joi.string().required(),
            item: Joi.string().required(),
            weight: Joi.number().required(),
            location: Joi.string().required(),
            targetLocation: Joi.string().required(),
            anotherPhone:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}),
            category: Joi.string().required(),
            buyOrdeliver: Joi.string().required().valid('buy', 'deliver').default('buy'),
            date: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000).iso().messages({
                'date.format': `Date format is YYYY-MM-DD`,
                'date.min': `Date should not be passed`
              }).required(),
        })
     
};

const deleteRequest = {
    params: Joi.object().keys({
        requestId: Joi.string().custom(objectId),
    }),
};

const sendRequest = {
    params: Joi.object().keys({
        tripId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        state: Joi.string().valid('processing', 'confirmed', 'accepted', 'pickedup', 'onmyway', 'delivered').default('processing'),
        rate: Joi.number(),
        reward: Joi.number(),
        qrCode: Joi.string(),
        userId: Joi.string().custom(objectId),
        // traveler: Joi.string().custom(objectId),
        trip: Joi.string().custom(objectId),
        to: Joi.string().required(),
        from: Joi.string().required(),
        item: Joi.string().required(),
        weight: Joi.number().required(),
        location: Joi.string().required(),
        targetLocation: Joi.string().required(),
        anotherPhone:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}),
        category: Joi.string().required(),
        buyOrdeliver: Joi.string().required().valid('buy', 'deliver').default('buy'),
        date: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000).iso().messages({
            'date.format': `Date format is YYYY-MM-DD`,
            'date.min': `Date should not be passed`
          }).required(),

    }),

};

module.exports = {
    createRequest,
    getRequests,
    getRequest,
    updateRequest,
    deleteRequest,
    sendRequest,
};
