const user = require("../model/userModel/UserModel");

var admin = require("firebase-admin");

var serviceAccount = require("../firebaseCred.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const middleWareforAuth = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(404).json({ msg: "Unauthorised User , token expired" });
    }
    const tokenParts = token.split(" ");
    const idToken = tokenParts[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken?.uid;

    const findUser = await user.findOne({ uid });
    if (!findUser) {
      return res.status(404).json({ msg: "Unauthorized User, User not found" });
    }
    req.user = findUser;

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message?.slice(0, 30) });
  }
};

module.exports = {
  middleWareforAuth,
};
