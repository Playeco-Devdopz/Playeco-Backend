const user = require("../../model/userModel/UserModel");

const getUser = async (req, res) => {
  try {
    const allUsers = await user.find();
    return res.status(200).json(allUsers);
  } catch (err) {
    console.log(err, "getUser error");
    return res.status(500).json({ msg: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, name, uid } = req.body;
    const isUser = await user.findOne({ email });
    if (isUser) {
      return res.status(202).json({ msg: "User already exists" });
    }
    const newUser = await user.create({
      name,
      email,
      uid,
    });
    return res.status(200).json(newUser);
  } catch (err) {
    console.log(err, "create User error");
    return res.status(500).json({ msg: err.message });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const singleUser = req.user;

    if (!singleUser) {
      return res.status(404).json({ msg: "No user found" });
    }
    return res.status(200).json({ singleUser });
  } catch (err) {
    console.log(err, "Single User Error");
    return res.status(500).json({ msg: err.message });
  }
};

const findSingleUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const existingUser = await user.findOne({ uid }).populate("videos");
    if (!existingUser) return res.status(404).json({ msg: "No user found" });
    res.status(200).json(existingUser);
  } catch (err) {
    console.log(err, "find User Error");
    return res.status(500).json({ msg: err.message });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio, bgmiId, upiId, image } = req.body;

    const isUserExist = await user.findById(id);
    if (!isUserExist) {
      return res.status(404).json({ msg: "User Not found" });
    }

    const updatedUser = await user.findByIdAndUpdate(id, {
      name,
      // email,
      bio,
      bgmiId,
      upiId,
      image,
    });

    return res.status(200).json({ msg: "User Updated Successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const toggleFollow = async (req, res) => {
  try {
    const { videoUserId } = req.params;
    const { userId } = req.body;

    const findUser = await user.findById(videoUserId);
    if (!findUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const userIndex = findUser.followers.indexOf(userId);

    if (userIndex === -1) {
      findUser.followers.push(userId);
    } else {
      findUser.followers.splice(userIndex, 1);
    }

    await findUser.save();

    return res.status(200).json({
      msg: "Follow status updated",
      followers: findUser.followers.length,
    });
  } catch (err) {
    console.log(err, "toggle follow error");
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  createUser,
  editUser,
  getUser,
  getSingleUser,
  findSingleUser,
  toggleFollow,
};
