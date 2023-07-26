const knex = require("../database/knexConfig");

const createClient = async (req, res) => {

  const client = req.body
  try {
    const findEmail = await knex("clients").where({ email: client.email }).first();
    const findcpf = await knex("clients").where({ cpf: client.cpf }).first();

    if (findEmail) {
      return res.status(400).json("Já existe um cliente cadastrado com este e-mail.")
    }
    if (findcpf) {
      return res.status(400).json("Já existe um cliente cadastrado com este CPF.")
    }

    await knex("clients")
      .insert(client)
      .returning("*");
    return res.status(201).json("Cliente cadastrado com sucesso.")
  } catch (err) {
    return res.status(500).json("Erro interno do servidor.")
  }

}

const clientList = async (req, res) => {

  try {
    const allClients = await knex('clients')
    return res.status(200).json(allClients)
  } catch (err) {
    return res.status(500).json("Erro interno do servidor.")
  }
}

module.exports = {
  createClient,
  clientList
}