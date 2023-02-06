const Joi = require('joi');

module.exports = Joi.object({
  // is url and ends with .csv
  urlLink: Joi.string()
    .uri()
    .regex(/\.csv$/),
});
