const joi = require("joi");

const validateUser = joi.object({
	name: joi.string().required().trim().messages({
		"any.required": "O campo nome é obrigatório",
		"string.empty": "O campo nome não pode ser vázio"
	}),
	email: joi.string().email().required().messages({
		"any.required": "O campo e-mail é obrigatório",
		"string.empty": "O campo e-amil não pode ser vázio",
		"string.email": "O campo e-mail não está em um formato válido"
	}),
	password: joi.string().required().trim().messages({
		"any.required": "O campo senha é obrigatório",
		"string.empty": "O campo senha não pode ser vázio",
	}),
	cpf: joi.number().min(10000000000).max(99999999999).messages({
		"number.base": "O campo cpf deve ser um composto apenas por números",
		"number.min": "O campo cpf deve conter 11 números",
		"number.max": "O campo cpf deve conter 11 números"
	}),
	phone: joi.number().min(10000000).max(99999999999).messages({
		"number.base": "O campo telefone deve ser um composto apenas por números",
		"number.min": "O campo telefone deve conter no mínimo 8 números",
		"number.max": "O campo telefone deve conter no máximo 11 números"
	})
});


module.exports = validateUser;