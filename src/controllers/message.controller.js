const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { messageService } = require('../services');

const createMessage = catchAsync(async (req, res) => {
    const message = await messageService.createMessage(req);
    res.status(httpStatus.OK).send(message);
  });


  const getMessages = catchAsync(async (req, res) => {
    const message = await messageService.getMessages(req);
    res.status(httpStatus.OK).send(message);
  });

  module.exports = {
    createMessage,
    getMessages
  };