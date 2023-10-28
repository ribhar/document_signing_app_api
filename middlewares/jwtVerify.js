/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
const statusCodes = require("http-status");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const config = require("../configs/config");

const verifyToken = async (req, res, next) => {
  try {
    res.lang = req.headers.lang ? req.headers.lang : "en";
    const { authorization } = req.headers;
    if (!authorization) {
      return next(
        new ApiError(
          statusCodes.UNAUTHORIZED,
          statusCodes[statusCodes.UNAUTHORIZED]
        )
      );
    }
    if (!authorization && authorization.split(" ")[0] === "Bearer") {
      return next(
        new ApiError(
          statusCodes.UNAUTHORIZED,
          statusCodes[statusCodes.UNAUTHORIZED]
        )
      );
    }
    const token = authorization.split(" ")[1];
    let decoded;
    try {
      decoded = await jwt.verify(token, config.jwt.secret);
    } catch (err) {
      console.error("JWT verification failed");
      throw err; // rethrow the error to be caught by the outer catch block
    }

    req.userData = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };
    next();
  } catch (error) {
    // Handle the error appropriately
    console.error("An error occurred:", error);
    return next(
      new ApiError(
        statusCodes.INTERNAL_SERVER_ERROR,
        statusCodes[statusCodes.INTERNAL_SERVER_ERROR]
      )
    );
  }
};

module.exports = { verifyToken };
