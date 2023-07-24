const knex = require("../database/knexConfig");
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingEmail = await knex("users").where({ email }).first();

    if (existingEmail) {
      return res.status(400).json("O email informado já está cadastrado");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await knex("users")
      .insert({
        name,
        email,
        password: encryptedPassword
      })
      .returning("*");

    const { password: _, cpf, phone, ...registeredUser } = user[0]

    return res.status(201).json(registeredUser);

  } catch (error) {
    return res.status(500).json("Erro interno do servidor.");
  }
}

const updateUser = async (req, res) => {
  const { name, email, password, cpf, phone } = req.body;
  const { id } = req.user;
  const dataToBeUpdated = { name, email }

  try {
    const existingUser = await knex("users").where({ id }).first();

    if (!existingUser) {
      return res.status(404).json("Usuário não encontrado.");
    }

    if (email !== req.user.email) {
      const existingEmail = await knex("users").where({ email }).first();

      if (existingEmail) {
        return res.status(400).json("O email informado já está cadastrado.");
      }
    }

    if (password) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      dataToBeUpdated.password = encryptedPassword;
    }

    if (cpf) {
      const existingCpf = await knex("users").where({ cpf }).first();
      if (existingCpf && existingCpf.id !== existingUser.id) {
        return res.status(400).json("O CPF informado já está cadastrado.");
      }
      dataToBeUpdated.cpf = cpf
    }

    if (phone) {
      dataToBeUpdated.phone = phone
    }

    await knex('users')
      .where({ id })
      .update(dataToBeUpdated);

    return res.status(200).json("Usuário atualizado com sucesso!");

  } catch (error) {
    return res.status(500).json("Erro interno do servidor.");
  }
}

const getUser = async (req, res) => {
  res.status(200).json(req.user);
}

module.exports = {
  registerUser,
  updateUser,
  getUser
}