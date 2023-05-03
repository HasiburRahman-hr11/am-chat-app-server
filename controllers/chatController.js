const Chat = require("../models/Chat");

exports.createNewChat = async (req, res) => {
  const senderId = req.body.senderId;
  const receiverId = req.body.receiverId;

  try {

    const isChat = await Chat.find({
      members: {$all : [senderId , receiverId]}
    });

    if (isChat.length > 0) {
      res.status(200).json(isChat);
    } else {
      const newChat = new Chat({
        members: [senderId, receiverId],
      });
      await newChat.save();
      res.status(201).json(newChat);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getChatByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chat = await Chat.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
