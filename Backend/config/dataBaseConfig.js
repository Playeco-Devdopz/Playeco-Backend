const { mongoose } = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to Database");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDb;
