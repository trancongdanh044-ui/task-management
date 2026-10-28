const express = require('express');
const router = express.Router();

const controller = require('../controller/user.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otp);

router.post("/password/change", controller.changePassword);

router.get("/logout", authMiddleware.requireAuth, controller.logOut);

router.get("/list", authMiddleware.requireAuth, controller.list);

module.exports = router;