const express = require('express');
const router = express.Router();
const controllers = require('../../controller/chat/ParticipantsController')
 
router.get('/participants',controllers.index);

module.exports = router;