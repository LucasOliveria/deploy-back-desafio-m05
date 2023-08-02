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

    const registeredClient = await knex("clients")
      .insert(client)
      .returning("*");

    return res.status(201).json({ ...registeredClient[0], up_to_date: true });
  } catch (err) {
    return res.status(500).json("Erro interno do servidor.")
  }

}

const clientList = async (req, res) => {

  try {

    const allClients = await knex('clients as c')
      .select([
        'c.id',
        'c.name',
        'c.email',
        'c.cpf',
        'c.phone',
        'c.zip_code',
        'c.public_place',
        'c.complement',
        'c.district',
        'c.city',
        'c.uf',
        knex.raw(`
        CASE
          WHEN COUNT(ch.id) = 0 THEN true
          WHEN COUNT(ch.id) FILTER (WHERE ch.due_date < CURRENT_DATE AND ch.status = 'pendente') > 0 THEN false
          ELSE true
        END AS up_to_date
      `)
      ])
      .leftJoin('charges as ch', 'c.id', 'ch.client_id')
      .groupBy('c.id').orderBy("id", "asc");


    return res.status(200).json(allClients)
  } catch (err) {
    return res.status(500).json("Erro interno do servidor.")
  }
}

const updateClient = async (req, res) => {
  const { name, email, cpf, phone, zip_code, public_place,
    complement, district, city, uf } = req.body;

  const { id } = req.params;

  const dataToBeUpdated = {
    name,
    email,
    cpf,
    phone
  }

  try {
    const existingClient = await knex('clients').where({ id }).first();

    if (!existingClient) {
      return res.status(404).json("Cliente não encontrado");
    }

    const existingEmail = await knex("clients").where({ email }).first();

    if (existingEmail && existingEmail.email !== existingClient.email) {
      return res.status(400).json("O email informado já está cadastrado.");
    }

    const existingCpf = await knex("clients").where({ cpf }).first();

    if (existingCpf && existingCpf.cpf !== existingClient.cpf) {
      return res.status(400).json("O CPF informado já está cadastrado.");
    }

    if (zip_code) {
      dataToBeUpdated.zip_code = zip_code;
    }

    if (public_place) {
      dataToBeUpdated.public_place = public_place;
    }

    if (complement) {
      dataToBeUpdated.complement = complement;
    }

    if (district) {
      dataToBeUpdated.district = district;
    }

    if (city) {
      dataToBeUpdated.city = city;
    }

    if (uf) {
      dataToBeUpdated.uf = uf;
    }

    await knex('clients')
      .where({ id })
      .update(dataToBeUpdated);

    const updateClientFormat = await knex('clients as c')
      .select([
        'c.id',
        'c.name',
        'c.email',
        'c.cpf',
        'c.phone',
        'c.zip_code',
        'c.public_place',
        'c.complement',
        'c.district',
        'c.city',
        'c.uf',
        knex.raw(`
      CASE
        WHEN COUNT(ch.id) = 0 THEN true
        WHEN COUNT(ch.id) FILTER (WHERE ch.due_date < CURRENT_DATE AND ch.status = 'pendente') > 0 THEN false
        ELSE true
      END AS up_to_date
    `)
      ])
      .leftJoin('charges as ch', 'c.id', 'ch.client_id').where('c.id', id)
      .groupBy('c.id').first();

    return res.status(200).json(updateClientFormat);

  } catch (error) {
    return res.status(500).json("Erro interno do servidor.");
  }

}

module.exports = {
  createClient,
  clientList,
  updateClient
}