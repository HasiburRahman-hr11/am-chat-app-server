const Message = require("../models/Message");

exports.createNewMessage = async (req, res) => {
  const { chatId, sender, text } = req.body;
  try {
    const newMessage = new Message({
      chatId,
      sender,
      text,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getMessagesByChatId = async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const messages = await Message.find({
      chatId: chatId,
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
