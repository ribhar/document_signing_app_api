const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envVarsSchema = Joi.object()
  .keys({
    // Common
    PORT: Joi.number().default(8080),

    // Database
    DB_URI: Joi.string().required(),

    // JWT
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_SECRET_EXPIRY: Joi.string().required().description("JWT secret key"),

    SESSION_SECRET: Joi.string().required().description("session secret key"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
module.exports = {
  port: envVars.PORT,
  db: {
    dbURI: envVars.DB_URI,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    secretExpiry: envVars.JWT_SECRET_EXPIRY,
  },
  misc: {
    sessionSecret: envVars.SESSION_SECRET,
  },
};
