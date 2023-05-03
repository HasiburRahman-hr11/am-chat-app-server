const { createNewMessage, getMessagesByChatId } = require("../controllers/messageController");


const router = require("express").Router();

// Create New Message
router.post('/chat/message/create' , createNewMessage);

// Get Messages By Chai ID
router.get('/chat/message/all/:chatId' , getMessagesByChatId)


module.exports = router;
