const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const requestRoutes = require('./request.route');
const travelerRoute = require('./traveler.route');
const tripRoute = require('./trip.route');


const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [{
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
