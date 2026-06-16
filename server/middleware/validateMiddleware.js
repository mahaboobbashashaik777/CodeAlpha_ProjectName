const Joi = require('joi');

const translateSchema = Joi.object({
  text: Joi.string().trim().min(1).max(5000).required().messages({
    'string.empty': 'Text to translate cannot be empty',
    'string.max': 'Text length cannot exceed 5000 characters',
    'any.required': 'Text is a required field'
  }),
  source: Joi.string().trim().min(2).max(10).required().messages({
    'string.empty': 'Source language cannot be empty',
    'any.required': 'Source language is a required field'
  }),
  target: Joi.string().trim().min(2).max(10).required().messages({
    'string.empty': 'Target language cannot be empty',
    'any.required': 'Target language is a required field'
  })
});

const validateTranslate = (req, res, next) => {
  const { error } = translateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorDetails = error.details.map(err => err.message).join(', ');
    const validationError = new Error(errorDetails);
    validationError.status = 400;
    return next(validationError);
  }
  next();
};

module.exports = {
  validateTranslate
};
