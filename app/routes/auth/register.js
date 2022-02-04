const express = require('express');
const router = express.Router();
const controllers = require('../../controller/auth/RegisterController')

router.post('/register',controllers.store);

module.exports = router;