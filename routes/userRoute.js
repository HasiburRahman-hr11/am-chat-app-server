const {
  createNewUser,
  loginController,
  getAllUsers,
  editUser,
  deleteUser,
  getSingleUser,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/user/add-user", createNewUser);
router.post("/user/login", loginController);
router.get("/user/get-user/:id", getSingleUser);

router.get("/user/all-users", getAllUsers);
router.put("/admin/user/edit-user/:id", editUser);
router.delete("/admin/user/delete-user/:id", deleteUser);

module.exports = router;
