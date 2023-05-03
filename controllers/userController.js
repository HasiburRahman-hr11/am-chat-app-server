const User = require("../models/User");
const bcrypt = require("bcrypt");

// Create New User
exports.createNewUser = async (req, res) => {
  let { firstName, lastName, email, password } = req.body;

  try {
    const isExist = await User.findOne({ email: email });
    if (isExist) {
      res.status(409).json({
        message: "Username or Email already exist!",
      });
    } else {
      let hashedPassword = await bcrypt.hash(password, 11);
      let user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: req.body?.role || "subscriber",
      });
      if (req.body?.role === "admin") {
        user.isAdmin = true;
      } else {
        user.isAdmin = false;
      }
      if (req?.files?.profilePicture) {
        const profilePictureData = req.files.profilePicture.data;
        const encodedProfilePicture = profilePictureData.toString("base64");
        const profilePicture = Buffer.from(encodedProfilePicture, "base64");
        user.profilePicture = profilePicture;
      }
      await user.save();
      res.status(201).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Login Controller
exports.loginController = async (req, res) => {
  let { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      let matchPass = await bcrypt.compare(password, user.password);
      if (matchPass) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "Invalid Password!",
        });
      }
    } else {
      res.status(404).json({
        message: "No User Found!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Get Single User
exports.getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Update User
exports.editUser = async (req, res) => {
  const { id } = req.params;

  let userData = { ...req.body };

  if (req.body?.role === "admin") {
    userData.isAdmin = true;
  } else {
    userData.isAdmin = false;
  }

  if (req?.files?.profilePicture) {
    const profilePictureData = req.files.profilePicture.data;
    const encodedProfilePicture = profilePictureData.toString("base64");
    const profilePicture = Buffer.from(encodedProfilePicture, "base64");
    userData.profilePicture = profilePicture;
  }
  try {
    const user = await User.findById(id);
    if (user) {
      const updatedUser = await User.findByIdAndUpdate(id, userData, {
        new: true,
      });
      res.status(201).json(updatedUser);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      await User.findByIdAndDelete(id);
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
