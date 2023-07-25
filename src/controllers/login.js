const knex = require("../database/knexConfig");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {

  try {
    const { email, password } = req.body
    const user = await knex("users").where({ email }).first();

    if (!user) {
      return res.status(400).json("Email ou senha invalidos");
    }

    const passwordValidate = await bcrypt.compare(password, user.password)

    if (!passwordValidate) {
      return res.status(400).json("Email ou senha invalidos.");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS, {
      expiresIn: '8h'
    })

    const userProfile = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: token
    }
    return res.status(200).json(userProfile)
  } catch (err) {
    return res.status(500).json("Erro interno do servidor.");
  }

}

module.exports = {
  login
}