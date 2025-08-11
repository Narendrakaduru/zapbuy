const express = require('express');
const router = express.Router();
const logController = require('../controllers/log.controller');

// POST /api/logs - create a log
router.post('/', logController.createLog);

// GET /api/logs - view logs with optional filters
router.get('/', logController.getLogs);

// DELETE /api/logs/:id - delete a log
router.delete('/:id', logController.deleteLog);

module.exports = router;
