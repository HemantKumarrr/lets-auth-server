const User = require("../models/user.model");
const { createAccessToken } = require("../middleware/jwt_init");
const { NODE_ENV } = require("../constants/env");
const secure = NODE_ENV !== "development";

const handleError = (err) => {
  const error = { email: null, password: null };
  // Unique Email Validation
  if (err.code === 11000) {
    return (error["email"] = "email already register");
  }
  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }
  return error;
};

module.exports = {
  signup: async (req, res) => {
    try {
      const { username, email, password, gender } = req.body;
      const data = await User.create({ username, email, password, gender });
      const accessToken = createAccessToken(data._id);
      res.cookie("accessToken", accessToken, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: "strict",
        secure: secure,
      });
      res.json({ uid: data._id });
    } catch (err) {
      const error = handleError(err);
      res.status(400).json({ error: error });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const data = await User.login(email, password);
      const accessToken = createAccessToken({ uid: data._id });
      // console.log("AccessToken: ", accessToken);
      res.cookie("accessToken", accessToken, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: "strict",
        secure: secure,
      });
      res.json({ uid: data._id });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  logOut: async (req, res) => {
    try {
      res.cookie("accessToken", " ", {
        maxAge: 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: secure,
      });
      res.status(200).send("User Logged Out");
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
