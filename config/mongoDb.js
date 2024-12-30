const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  try {
    mongoose.connect(process.env.DB_URL);
    console.log("successfully DB connected");
  } catch (err) {
    console.log({ error: err });
  }
};

module.exports = dbConnect;
