const express = require('express');
const router = express.Router();
const controllers = require('../../controller/chat/ConversationController')

router.get('/conversations',controllers.index);
router.post('/conversations',controllers.store);
router.get('/conversation',controllers.one);
router.get('/conversation/mark-as-seen', controllers.markAsSeen)
router.put('/conversation',controllers.update)
    
     
module.exports = router;