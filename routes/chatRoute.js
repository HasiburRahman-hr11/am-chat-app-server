const { createNewChat, getChatByUserId } = require("../controllers/chatController");

const router = require("express").Router();

// Create New Chat
router.post("/chat/create", createNewChat);

// Get Chat By User Id
router.get('/chat/get/:userId' , getChatByUserId);

module.exports = router;
