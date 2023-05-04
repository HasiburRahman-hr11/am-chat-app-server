const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const socketio = require('socket.io');

http = require("http");

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");

require("dotenv").config();


const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(fileUpload());

// Routes
app.use(userRoute);
app.use(chatRoute);
app.use(messageRoute);


const PORT = process.env.PORT || 8080;
// const io = require("socket.io")(8800, { cors: { origin: "*" } });



const server = app.listen(PORT, () => {
  console.log(`Server is connected at http://localhost:${PORT}`);
});
const io = socketio(server ,{ cors: { origin: "*" } });

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user && user?.socketId) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});



mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ifpuy1o.mongodb.net/am-chat`
  )
  .then(() => {
    console.log("Database Connected.");
    // app.listen(PORT, () => {
    //   console.log(`Server is connected at http://localhost:${PORT}`);
    // });
  })
  .catch((error) => {
    console.log(error);
  });
