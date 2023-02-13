const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { requestService } = require('../services');

const createRequest = catchAsync(async (req, res) => {
    const request = await requestService.createRequest(req.body);
    res.status(httpStatus.CREATED).send(request);
});
//↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓.↓
const getRequests = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await requestService.queryRequests(filter, options);
    res.send(result);
});

const getRequest = catchAsync(async (req, res) => {
    const request = await requestService.getRequestById(req.params.requestId);
    if (!request) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
    }
    res.send(request);
});

const updateRequest = catchAsync(async (req, res) => {
    const request = await requestService.updateRequestById(req.params.request, req.body);
    res.send(request);
});

const deleteRequest = catchAsync(async (req, res) => {
    await requestService.deleteRequestById(req.params.requestId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createRequest,
    getRequests,
    getRequest,
    updateRequest,
    deleteRequest,
};
