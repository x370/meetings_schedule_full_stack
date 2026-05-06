const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

router.post('/', actionController.addActionItem);
router.put('/:id', actionController.markAsDone);

module.exports = router;
