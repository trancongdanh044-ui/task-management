const express = require('express');
const router = express.Router();

const controller = require('../controller/profile.controller');

router.get("/detail", controller.detail);

router.get("/detail/:userId", controller.detail);

module.exports = router;