const express = require("express");
const router = express.Router();
const documentRoute = require("./document.route");
const userRoute = require("./user.route");
const path = require("path");

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.get("/", (req, res) => {
  res.send("Welcome to the Document Signing Application API");
});

const defaultRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/doc",
    route: documentRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
