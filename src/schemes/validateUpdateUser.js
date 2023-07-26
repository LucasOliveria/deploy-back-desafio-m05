const joi = require("joi");

const validateUpdateUser = joi.object({
  name: joi.string().required().trim().messages({
    "any.required": "O campo nome é obrigatório",
    "string.empty": "O campo nome não pode ser vázio"
  }),
  email: joi.string().email().required().messages({
    "any.required": "O campo e-mail é obrigatório",
    "string.empty": "O campo e-amil não pode ser vázio",
    "string.email": "O campo e-mail não está em um formato válido"
  }),
  password: joi.string().allow(null, '').messages({
    "string.base": "O campo senha deve ser uma string"
  }),
  cpf: joi.string().length(11).pattern(/^\d+$/).allow(null, '').messages({
    "string.length": "O campo cpf deve ser composto por 11 números",
    "string.pattern.base": "O campo cpf deve ser composto por 11 números"
  }),
  phone: joi.string().length(11).pattern(/^\d+$/).allow(null, '').messages({
    "string.length": "O campo telefone deve ser composto por 11 números",
    "string.pattern.base": "O campo telefone deve ser composto por 11 números"
  })
});


module.exports = validateUpdateUser;