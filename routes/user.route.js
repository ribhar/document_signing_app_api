const express = require("express");
const { userController } = require("../controllers/");
const validate = require("../middlewares/validate");
const { userValidation } = require("../validations");

const router = express.Router();

// Auth
router.post(
  "/register",
  validate(userValidation.register),
  userController.register
);

router.post("/login", validate(userValidation.login), userController.login);

module.exports = router;
