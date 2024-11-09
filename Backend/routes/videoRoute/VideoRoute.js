const express = require("express");
const {
  postVideo,
  getUserVideos,
  videoDelete,
  getAllVideos,
  addComment,
  toggleLikeVideo,
  searchVideos,
} = require("../../controllers/videoUpload/VideoControllers");
const { middleWareforAuth } = require("../../middleware/Middleware");

const router = express.Router();

router.post("/video/create", middleWareforAuth, postVideo);
router.get("/videos/:userId", middleWareforAuth, getUserVideos);
router.delete(
  "/videos/delete/:userId/:videoId",
  middleWareforAuth,
  videoDelete
);
router.get("/videos", getAllVideos);
router.post("/video/:videoId", middleWareforAuth, addComment);
router.post("/video/like/:videoId", middleWareforAuth, toggleLikeVideo);

router.get("/video/search", middleWareforAuth, searchVideos);

module.exports = router;
