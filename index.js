const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { PORT, APP_ORIGIN } = require("./constants/env");
const dbConnect = require("./config/mongoDb");
// const startDeletionProcess = require("./services/autoDeleteUser");

// Connection to Database
dbConnect();

app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // allows us to parse incoming cookies

// Deleting user after 5 min they created account
// startDeletionProcess(10);

// Routes
app.use("/v1", authRoute);
app.use("/v1", userRoute);
app.get("/v1", (req, res) => {
  res.status(200).json({ message: "App is Working!" });
});

// Error Handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening at PORT : ${PORT}`);
});
