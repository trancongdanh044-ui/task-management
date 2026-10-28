const taskRoute = require('./task.route');
const userRoute = require('./user.route');
const profileRoute = require('./profile.route');

const authMiddleware = require('../../../middlewares/auth.middleware');

module.exports = (app) =>{
  const version = "/api/v1"
  app.use(version + "/tasks", authMiddleware.requireAuth, taskRoute);

  app.use(version + "/profile", authMiddleware.requireAuth, profileRoute);

  app.use(version + "/users", userRoute);
}