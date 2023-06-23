const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { users, addUser, removeUser, getUser} = require('./socket/index');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
    const io = require('socket.io')(server, {
      cors: {
         origin: "*",
         methods: ["GET", "POST"],
      },
    });
    logger.info('Socket server is running');
    io.on('connection', (socket) => {
      console.log('a user connected.');

      socket.on('addUser', (userId) => {
        addUser(userId, socket.id);
        io.emit('getUsers', users);
      });

      socket.on('sendMessage', ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        console.log(user);
        console.log('senderId', senderId);
        console.log('receiverId', receiverId);
        console.log(text);
        io.to(user.socketId).emit('getMessage', {
          senderId,
          text,
        });
      });

      socket.on('disconnect', () => {
        console.log('a user disconnected!');
        removeUser(socket.id);
        io.emit('getUsers', users);
      });
    });
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
