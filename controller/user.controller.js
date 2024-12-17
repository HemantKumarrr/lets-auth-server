const User = require("../models/user.model");
const { putImageUrl, deleteImageUrl } = require("../services/s3bucket");

module.exports = {
  getUser: async (req, res) => {
    try {
      const uid = req.params.id;
      const data = await User.findById({ _id: uid });
      res.status(200).json({
        user: {
          username: data.username,
          imageUrl: data.imageUrl,
          email: data.email,
          gender: data.gender,
        },
      });
    } catch (err) {
      console.log(err);
      res.send({ error: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ error: "Unauthorized" });
      const data = await User.deleteOne({ _id: id });
      res.status(200).json({ message: "user deleted" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  updateUserProfile: async (req, res) => {
    try {
      const id = req.params.id;
      const updateUser = await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json({
        user: updateUser,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  },
  deleteProfileImageUrl: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      const imageUrl = user.imageUrl;
      const deletePath = await deleteImageUrl(imageUrl);
      res.status(200).json({ message: "file delete sucessfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  uploadImage: async (req, res) => {
    const id = req.params.id;
    const file = req.file.location;

    if (!req.file) return res.status(400).json({ error: "no file found" });
    const user = await User.findById(id);
    if (!user) return res.statu(400).json({ error: "user not exist" });
    const imageUrl = user.imageUrl;
    if (imageUrl) {
      const deletePath = await deleteImageUrl(
        "uploads/images/users/IMG_0780.JPG"
      );
      const deleteFetch = await fetch(deletePath, { method: "DELETE" });
      console.log(deleteFetch);
    }
    const updateUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: { imageUrl: file },
      },
      { new: true }
    );
    res.status(200).json({ message: "upload sucessfully" });
  },
};
