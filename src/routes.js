const express = require('express');
const uploadController = require('./controllers/uploadController');
const validateController = require('./controllers/validateController');
const processController = require('./controllers/processController');
const receiptsController = require('./controllers/receiptsController');


module.exports = (upload) => {

  const router = express.Router();

  router.post('/upload', upload.single('file'), uploadController.uploadFile);
  router.post('/validate', upload.single('file'), validateController.validateFile);
  router.post('/process/:id', processController.processReceipt);
  router.get('/receipts', receiptsController.getAllReceipts);
  router.get('/receipts/:id', receiptsController.getReceiptById);

  return router;
};