const express = require('express');
const router = express.Router();
const controllers = require('../controller/blockedUsersController');

router.get('/block',controllers.index);
router.post('/block', controllers.store);
router.delete('/block', controllers.deleteItem);
router.get('/blockedothers', controllers.indexBlockedOthers);

module.exports = router;