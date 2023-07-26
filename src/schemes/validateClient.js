const joi = require("joi");

const validateClient = joi.object({
  name: joi.string().required().trim().messages({
    "any.required": "O campo nome é obrigatório",
    "string.empty": "O campo nome não pode ser vázio"
  }),

  email: joi.string().email().required().messages({
    "any.required": "O campo e-mail é obrigatório",
    "string.empty": "O campo e-amil não pode ser vázio",
    "string.email": "O campo e-mail não está em um formato válido",
    "string.base": "O campo e-mail não está em um formato válido"
  }),

  cpf: joi.string().length(11).pattern(/^\d+$/).required().messages({
    "any.required": "O campo cpf é obrigatório",
    "string.empty": "O campo cpf é obrigatório",
    "string.base": "O campo cpf é obrigatório",
    "string.pattern.base": "O campo cpf deve ser composto por 11 números",
    "string.length": "O campo cpf deve ser composto por 11 números"
  }),

  phone: joi.string().length(11).pattern(/^\d+$/).required().messages({
    "any.required": "O campo telefone é obrigatório",
    "string.empty": "O campo telefone é obrigatório",
    "string.base": "O campo telefone é obrigatório",
    "string.pattern.base": "O campo telefone deve ser composto por 11 números",
    "string.length": "O campo telefone deve ser composto por 11 números"
  }),

  zip_code: joi.string().length(8).pattern(/^\d+$/).allow(null, '').messages({
    "string.pattern.base": "O campo cep deve ser composto por 8 números",
    "string.length": "O campo cep deve ser composto por 8 números"
  }),
  public_place: joi.string().allow(null, ''),
  complement: joi.string().allow(null, ''),
  district: joi.string().allow(null, ''),
  city: joi.string().allow(null, ''),
  uf: joi.string().valid(
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR',
    'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR',
    'SC', 'SP', 'SE', 'TO').allow(null, '').uppercase().messages({
      "any.only": "O campo UF aceita somente codigo de estado válido do Brasil.",
    }),
  up_to_date: joi.boolean().allow(null, '').messages({
    "boolean.base": "O campo Up to Date so aceita dados booleanos.",
  })
});

module.exports = validateClient;