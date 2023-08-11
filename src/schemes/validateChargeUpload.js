const joi = require("joi");

const validateChargeUpload = joi.object({

  description: joi.string().required().trim().messages({
    "any.required": "A descrição da cobrança é obrigatória.",
    "string.empty": "A descrição da cobrança é obrigatória.",
    "string.base": "A descrição da cobrança é obrigatória.",
  }),

  status: joi.string().valid('pendente', 'pago').required().trim().messages({
    "any.required": "O estado atual da cobrança é obrigatório.",
    "string.empty": "O estado atual da cobrança é obrigatório.",
    "string.base": "O estado atual da cobrança é obrigatório. Por favor informar se está pago ou pendente.",
    "any.only": "Somente os valores 'pago' e 'pendente' são aceitos.",
  }),

  value: joi.number().positive().integer().required().messages({
    "any.required": "O valor da cobrança é obrigatório.",
    "number.empty": "O valor da cobrança é obrigatório.",
    "number.base": "O valor da cobrança é obrigatório.",
    "number.positive": "O valor da cobrança deve ser positivo.",
    "number.integer": "O valor da cobrança deve ser inteiro.",
  }),

  due_date: joi.date().iso().required().messages({
    "any.required": "A data de vencimento é obrigatória.",
    "date.empty": "A data de vencimento é obrigatória.",
    "date.base": "A data de vencimento é obrigatória.",
    "date.iso": "A data de vencimento deve ser uma data no formato ISO.",
  }),

});


module.exports = validateChargeUpload;