const { Router } = require("express");
const { verifyAccessToken } = require("../middleware/jwt_init");
const {
  getUser,
  deleteProfileImageUrl,
  deleteUser,
  updateUserProfile,
  uploadImage,
} = require("../controller/user.controller");
const upload = require("../middleware/upload");

const route = Router();

route.get("/:id/get-user", verifyAccessToken, getUser);
route.post("/:id/upload-image", upload.single("file"), uploadImage);
route.put("/:id/update-profile", verifyAccessToken, updateUserProfile);

route.delete(
  "/:id/delete-profile-image",
  verifyAccessToken,
  deleteProfileImageUrl
);
route.delete("/:id/delete-account", verifyAccessToken, deleteUser);

module.exports = route;
