const express = require('express');
const { sendMessage, getMessage } = require('../controllers/messageController');

const router = express.Router();

router.post('/send', sendMessage);
router.get('/receive', getMessage);

module.exports = router;





