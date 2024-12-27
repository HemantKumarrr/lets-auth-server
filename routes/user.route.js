const { Router } = require("express");
const { verifyAccessToken } = require("../middleware/jwt_init");
const {
  getUser,
  deleteUser,
  deleteProfileImageUrl,
  updateUserProfile,
  uploadImage,
} = require("../controller/user.controller");
const upload = require("../middleware/upload");

const route = Router();

route.get("/:id/get-user", verifyAccessToken, getUser);
route.post("/:id/upload-image", upload.single("file"), uploadImage);
route.put("/:id/update-profile", verifyAccessToken, updateUserProfile);

route.delete(
  "/:id/delete-profile-image/:key",
  verifyAccessToken,
  deleteProfileImageUrl
);
route.delete("/:id/delete-account", verifyAccessToken, deleteUser);

module.exports = route;
