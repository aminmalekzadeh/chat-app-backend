const express = require('express');
const router = express.Router();
const controllers = require('../../controller/chat/ContactController')

router.get('/contacts',controllers.index);
router.get('/contact',controllers.search);
router.post('/contact',controllers.store);

module.exports = router;