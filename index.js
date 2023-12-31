const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const passport = require("./configs/passport");
const { connection } = require("./models");
const router = require("./routes");
const config = require("./configs/config");

const app = express();

// // Serve static files from the uploads directory
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use cors middleware
app.use(cors());

// Use express-session middleware
app.use(
  session({
    secret: config.misc.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

// Use passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Parse JSON request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.listen(config.port, async () => {
  try {
    await connection;
    console.log(`server is running on port ${config.port}`);
  } catch (error) {
    console.log("error: ", error);
  }
});
