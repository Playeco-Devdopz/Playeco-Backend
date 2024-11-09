const express = require("express");
const cors = require("cors");
const connectDb = require("./config/dataBaseConfig");
const userRoute = require("./routes/UserRoute/UserRoute");
const videoRoute = require("./routes/videoRoute/VideoRoute");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
connectDb();
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/", userRoute);
app.use("/", videoRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});
