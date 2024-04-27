const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/', eventController.createEvent);  // Route to create an event from raw text
router.get('/', eventController.getEvents);     // Route to get events, implementation not shown

module.exports = router;
