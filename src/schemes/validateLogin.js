const joi = require("joi");

const validateLogin = joi.object({
  email: joi.string().email().required().messages({
    "any.required": "O campo e-mail é obrigatório",
    "string.empty": "O campo e-amil não pode ser vázio",
    "string.email": "O campo e-mail não está em um formato válido"
  }),
  password: joi.string().required().trim().messages({
    "any.required": "O campo senha é obrigatório",
    "string.empty": "O campo senha não pode ser vázio",
  })
});

module.exports = validateLogin;