const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username required"],
      unique: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, "email required"],
      validate: [isEmail, "invalid email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password required"],
      minLength: [6, "password must be atleast 6 characters"],
      select: true,
    },
    gender: {
      type: String,
      default: "male",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const isUser = await this.findOne({ email });
  if (isUser) {
    const isPassword = await bcrypt.compare(password, isUser.password);
    if (isPassword) {
      return isUser;
    }
    throw Error("incorrect Password");
  }
  throw Error("user not exist");
};

const User = mongoose.model("users", userSchema);

module.exports = User;
