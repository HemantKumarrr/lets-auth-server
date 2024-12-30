const jwt = require("jsonwebtoken");
const { ACCESS_KEY } = require("../constants/env");
require("dotenv").config();

module.exports = {
  createAccessToken: ({ uid }) => {
    try {
      const token = jwt.sign({ uid }, ACCESS_KEY, {
        expiresIn: "1d",
      });
      return token;
    } catch (err) {
      console.log(err);
      return;
    }
  },
  verifyAccessToken: (req, res, next) => {
    const token = req.cookies.accessToken;
    if (token)
      return jwt.verify(token, process.env.ACCESS_KEY, (err, decodedToken) => {
        if (err) return res.json({ error: "Unauthorized" });
        next();
      });
    res.json({ error: "authorized token not found" });
  },
};
