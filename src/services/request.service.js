const httpStatus = require('http-status');
const { Request } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a request
 * @param {Object} requestBody
 * @returns {Promise<Request>}
 */
const createRequest = async (requestBody) => {
    return Request.create(requestBody);
};

/**
 * Query for requests
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryRequests>}
 */
const queryRequests = async (filter, options) => {
    const requests = await Request.paginate(filter, options);
    return requests;
};

/**
 * Get request by id
 * @param {ObjectId} id
 * @returns {Promise<Request>}
 */
const getRequestById = async (id) => {
    return Request.findById(id);
};

/**
 * Update request by id
 * @param {ObjectId} requestId
 * @param {Object} updateBody
 * @returns {Promise<Request>}
 */
const updateRequestById = async (requestId, updateBody) => {
    const request = await getRequestById(requestId);
    if (!request) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
    }
    Object.assign(request, updateBody);
    await request.save();
    return request;
};

/**
 * Delete request by id
 * @param {ObjectId} requestId
 * @returns {Promise<Request>}
 */
const deleteRequestById = async (requestId) => {
    const request = await getRequestById(requestId);
    if (!request) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
    }
    await request.remove();
    return request;
};

module.exports = {
    createRequest,
    queryRequests,
    getRequestById,
    updateRequestById,
    deleteRequestById,
};
