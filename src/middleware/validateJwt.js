const knex = require("../database/knexConfig");
const jwt = require('jsonwebtoken');

const verifyJwt = (async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json("Não autorizado");
  }

  const token = authorization.replace('Bearer ', '').trim();

  try {
    const { id } = jwt.verify(token, process.env.JWT_PASS);

    const existingUser = await knex('users').where({ id }).first();

    if (!existingUser) {
      return res.status(404).json("Usuário não encontrado");
    }

    const { password, ...user } = existingUser;

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json("Não autorizado");
  }
});

module.exports = verifyJwt;