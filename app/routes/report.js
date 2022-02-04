const express = require('express');
const router = express.Router();
const controllers = require('../controller/reportController');

router.post('/report', controllers.store);

module.exports = router;