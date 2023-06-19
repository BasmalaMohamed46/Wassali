const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const requestRoutes = require('./request.route');
const travelerRoute = require('./traveler.route');
const tripRoute = require('./trip.route');
const conversationRoute = require('./conversation.route');
const messageRoute = require('./message.route');
const adminRoute = require('./admin.route');

const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/requests',
    route: requestRoutes,
  },
  {
    path: '/travelers',
    route: travelerRoute,
  },
  {
    path: '/trips',
    route: tripRoute,
  },
  {
    path: '/conversations',
    route: conversationRoute,
  },
  {
    path: '/messages',
    route: messageRoute,
  },
  {
    path: '/admins',
    route: adminRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
