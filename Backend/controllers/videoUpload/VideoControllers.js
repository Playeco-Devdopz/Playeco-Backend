const { default: mongoose } = require("mongoose");
const user = require("../../model/userModel/UserModel");
const Video = require("../../model/videoModel/VideoModel");

const postVideo = async (req, res) => {
  try {
    const { title, description, video, thumbnail, userId , hashtag } = req.body;
    const existingUser = await user.findById(userId);

    if (!existingUser) {
      return res.status(400).json({ msg: "User not found" });
    }
    const newVideo = await Video.create({
      title,
      description,
      hashtag,
      video,
      thumbnail,
      userId,
    });
    existingUser?.videos?.push(newVideo._id);

    await existingUser.save();

    return res.status(200).json(newVideo);
  } catch (err) {
    console.log(err, "create video error");
    return res.status(500).json({ msg: err.message });
  }
};

const videoDelete = async (req, res) => {
  try {
    const { userId, videoId } = req.params;

    const existingUser = await user.findById(userId);

    if (!existingUser) {
      return res.status(400).json({ msg: "User not found" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(400).json({ msg: "Video not found" });
    }
    await Video.findByIdAndDelete(videoId);

    (existingUser.videos = existingUser.videos?.filter((id) => id != videoId)),
      await existingUser.save();

    return res.status(200).json({ msg: "Video deleted successfully" });
  } catch (err) {
    console.log(err, "delete video error");
    return res.status(500).json({ msg: err.message });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const allVideos = await Video.find()
      .populate("userId", "name image uid followers")
      .populate("comments.userId", "name image");

    return res.status(200).json(allVideos);
  } catch (err) {
    console.log(err, "all video getting error");
    return res.status(500).json({ msg: err.message });
  }
};

const getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;

    const userWithVideos = await user.findById(userId).populate({
      path: "videos",
      populate: {
        path: "comments.userId",
        select: "name image",
      },
    });

    if (!userWithVideos) {
      return res.status(400).json({ msg: "User not found" });
    }

    return res.status(200).json(userWithVideos.videos);
  } catch (err) {
    console.log(err, "get user videos error");
    return res.status(500).json({ msg: err.message });
  }
};

// Add comment

const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId, text } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ msg: "Video not found" });
    }

    const newComment = {
      userId,
      text,
    };

    video.comments.push(newComment);
    await video.save();

    return res.status(200).json({ msg: "Comment Added Successfully" });
  } catch (err) {
    console.log(err, "add comment error");
    return res.status(500).json({ msg: err.message });
  }
};

// like

const toggleLikeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId } = req.body;
    console.log(userId, "user");
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ msg: "Video not found" });
    }

    const userIndex = video.likes.indexOf(userId);

    if (userIndex === -1) {
      video.likes.push(userId);
    } else {
      video.likes.splice(userIndex, 1);
    }

    await video.save();

    return res
      .status(200)
      .json({ msg: "Liked status updated", likes: video.likes.length });
  } catch (err) {
    console.log(err, "toggle like video error");
    return res.status(500).json({ msg: err.message });
  }
};

// const searchVideos = async (req, res) => {
//   try {
//     const { query } = req.query;

//     if (!query) {
//       return res.status(400).json({ msg: "Query parameter is required" });
//     }

//     const users = await user.find({ $text: { $search: query } });
//     const userIds = users.map((user) => user._id);

//     const videos = await Video.aggregate([
//       {
//         $match: {
//           $or: [
//             { title: { $regex: query, $options: "i" } },
//             { userId: { $in: userIds } },
//           ],
//         },
//       },
//       {
//         $group: {
//           _id: "$userId",
//           video: { $first: "$$ROOT" },
//         },
//       },
//       {
//         $replaceRoot: { newRoot: "$video" },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $unwind: "$user",
//       },
//       {
//         $project: {
//           title: 1,
//           userId: 1,
//           "user.name": 1,
//           "user.image": 1,
//         },
//       },
//     ]);

//     return res.status(200).json(videos);
//   } catch (err) {
//     console.log(err, "search videos error");
//     return res.status(500).json({ msg: err.message });
//   }
// };

const searchVideos = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ msg: "Query parameter is required" });
    }

    const users = await user.find({ $text: { $search: query } });
    const userIds = users.map((user) => user._id);

    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { userId: { $in: userIds } },
      ],
    }).populate("userId", "name image uid followers ");

    return res.status(200).json(users);
  } catch (err) {
    console.log(err, "search videos error");
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  postVideo,
  getUserVideos,
  getAllVideos,
  videoDelete,
  addComment,
  toggleLikeVideo,
  searchVideos,
};
