const Joi = require("joi");


const uploadDocument = Joi.object({
  file: Joi.object({
    originalname: Joi.string().required(),
    buffer: Joi.binary().encoding('base64').required(),
    mimetype: Joi.string().valid('application/pdf').required(),
  }).required(),
});

const signDocument = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
  }),
  file: Joi.object({
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid('application/pdf', 'image/png', 'image/jpeg', 'image/jpg')
      .required(),
    size: Joi.number().required(),
  }),
};

const getSignedDocument = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  uploadDocument,
  signDocument,
  getSignedDocument,
};
