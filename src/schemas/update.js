const Joi = require('joi');

module.exports = Joi.object({
  ceo: Joi.string(),
  address: Joi.string(),
});
