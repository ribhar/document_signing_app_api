const Joi = require("joi");

const uploadDocument = Joi.object({
  file: Joi.any().required(),
});

const signDocument = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    signature: Joi.string().required(),
    pdfId: Joi.string().required(),
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
