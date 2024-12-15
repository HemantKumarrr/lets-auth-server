const { Router } = require("express");
const { signup, login, logOut } = require("../controller/auth.controller");
const { verifyAccessToken } = require("../middleware/jwt_init");
const route = Router();

route.post("/signup", signup);
route.post("/login", login);
route.get("/logout", verifyAccessToken, logOut);

module.exports = route;
