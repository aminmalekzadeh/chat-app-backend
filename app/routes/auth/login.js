const express = require('express');
const router = express.Router();
const controllers = require('../../controller/auth/LoginController')

router.post('/login',controllers.index);

module.exports = router;