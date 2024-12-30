const User = require("../models/user.model");
require("dotenv").config();
const {
  DeleteObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const { s3Client } = require("../services/s3bucket");

// Function to delete an existing image from S3
const deleteS3Image = async (fileKey) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/images/users/${fileKey}`,
  };

  try {
    // Check if the file exists
    await s3Client.send(new HeadObjectCommand(params));
    // Delete the file
    await s3Client.send(new DeleteObjectCommand(params));
    return `Deleted previous image: ${fileKey}`;
  } catch (err) {
    if (err.name === "NotFound") {
      return `No image found with key: ${fileKey}`;
    } else {
      return "Error deleting image:", err;
    }
  }
};

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
    const bucketName = "hemant-private"; // Replace with your bucket name
    const key = req.params.key; // File key passed as a URL parameter
    const id = req.params.id;

    const params = {
      Bucket: bucketName,
      Key: `uploads/images/users/${key}`,
    };

    try {
      const updateUser = await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            imageUrl: "",
          },
        },
        { new: true }
      );
      const data = await s3Client.send(new DeleteObjectCommand(params));
      res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  },
  uploadImage: async (req, res) => {
    const id = req.params.id;
    const file = req.file.location;

    if (!req.file) return res.status(400).json({ error: "no file found" });
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ error: "user not exist" });

    const imageUrl = user.imageUrl;
    const indexOfuserSlash = imageUrl.lastIndexOf("/");
    const key = imageUrl.slice(indexOfuserSlash + 1);
    console.log(key);

    // Delete the old image if the key is provided
    const oldImage = await deleteS3Image(key);
    console.log(oldImage);

    const updateUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: { imageUrl: file },
      },
      { new: true }
    );

    res.status(200).json({ message: "upload sucessfully", user: updateUser });
  },
};
