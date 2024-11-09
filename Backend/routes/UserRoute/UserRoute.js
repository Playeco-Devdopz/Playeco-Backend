const express = require("express");
const {
  createUser,
  editUser,
  getSingleUser,
  getUser,
  findSingleUser,
  toggleFollow,
} = require("../../controllers/user/UserControllers");
const { middleWareforAuth } = require("../../middleware/Middleware");

const router = express.Router();

router.post("/user/createUser", createUser);
router.patch("/user/editUser/:id", middleWareforAuth, editUser);
router.get("/user", middleWareforAuth, getUser);
router.get("/users/:uid", middleWareforAuth, findSingleUser);
router.get("/user/getUser", middleWareforAuth, getSingleUser);
router.post("/user/follow/:videoUserId", middleWareforAuth, toggleFollow);

module.exports = router;
