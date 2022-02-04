const express = require('express');
const router = express.Router();
const controllers = require('../controller/myAccountController');
const multer = require('multer');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const imageUploadPath = appDir + '/public/ImageProfile';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageUploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`)
    }
})

const imageUpload = multer({ storage: storage });
  
router.get('/my-account',controllers.index);
router.put('/my-account', imageUpload.array('ImageProfile'), controllers.update);

module.exports = router;