const express = require('express');
const router = express.Router();
const controllers = require('../../controller/chat/SearchController')
 
router.get('/search',controllers.index);

module.exports = router;