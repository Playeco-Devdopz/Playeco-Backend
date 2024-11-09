const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    uid: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    bgmiId: {
      type: String,
      default: "",
    },
    upiId: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);
userSchema.index({ name: 'text' }); 

const user = mongoose.model("user", userSchema);
module.exports = user;
