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

    // Misc
    SESSION_SECRET: Joi.string().required().description("session secret key"),

    // AWS
    AWS_ACCESS_KEY_ID_: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY_: Joi.string().required(),
    AWS_DEFAULT_REGION: Joi.string().required(),
    AWS_BUCKET: Joi.string().required(),
    // AWS_BUCKET_BASE_URL: Joi.string().required(),
    AWS_DOC_MEDIA_PATH: Joi.string().required(),

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
  aws: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID_,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY_,
    defaultRegion: envVars.AWS_DEFAULT_REGION,
    bucket: envVars.AWS_BUCKET,
    // bucketBaseUrl: envVars.AWS_BUCKET_BASE_URL,
    docMediaPath: envVars.AWS_DOC_MEDIA_PATH,
  },
  misc: {
    sessionSecret: envVars.SESSION_SECRET,
  },
};
