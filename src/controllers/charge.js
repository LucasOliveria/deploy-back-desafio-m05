const knex = require("../database/knexConfig");

const createCharge = async (req, res) => {
  try {
    const { client_id, description, value, due_date, status } = req.body;
    const client = await knex('clients').where({ id: client_id }).first();

    if (!client) {
      return res.status(404).json("Cliente não encontrado");
    }
    const newCharge = await knex("charges").insert({
      client_id,
      description,
      value,
      due_date,
      status,
    }).returning('id');

    const chargesData = await knex('charges as ch')
      .select(
        'ch.id',
        'ch.client_id',
        'cl.name as client_name',
        'ch.description',
        'ch.value',
        'ch.due_date',
        'ch.status',
        knex.raw(`
                    CASE
                        WHEN ch.status = 'pago' THEN 'Paga'
                        WHEN ch.status = 'pendente' AND ch.due_date < NOW() THEN 'Vencida'
                        ELSE 'Pendente'
                    END AS up_to_date
                `)
      )
      .innerJoin('clients as cl', 'ch.client_id', 'cl.id').where('ch.id', newCharge[0].id)
      .first();

    res.status(201).json(chargesData);
  } catch (error) {
    res.status(500).json("Falha ao criar cobrança.");
  }
}

const getClientCharge = async (req, res) => {
  try {
    const { client_id } = req.params;
    const client = await knex('clients').where({ id: client_id }).first();

    if (!client) {
      return res.status(404).json("Cliente não encontrado");
    }

    const charges = await knex('charges as ch')
      .where({ client_id })
      .select(
        'ch.id',
        'ch.client_id',
        'ch.description',
        'ch.value',
        'ch.due_date',
        'ch.status',
        knex.raw(`
                    CASE
                      WHEN ch.status = 'pago' THEN 'Paga'
                      WHEN ch.status = 'pendente' AND ch.due_date < DATE(NOW()) THEN 'Vencida'
                      ELSE 'Pendente'
                    END AS up_to_date
                `)
      );

    const result = {
      client: client,
      charges: charges,
    };

    res.json(result);

  } catch (error) {
    res.status(500).json("Erro interno do servidor.");
  }
};

const getChargesData = async () => {
  try {
    const chargesData = await knex('charges as ch')
      .select(
        'ch.id',
        'ch.client_id',
        'cl.name as client_name',
        'ch.description',
        'ch.value',
        'ch.due_date',
        'ch.status',
        knex.raw(`
                    CASE
                        WHEN ch.status = 'pago' THEN 'Paga'
                        WHEN ch.status = 'pendente' AND ch.due_date < NOW() THEN 'Vencida'
                        ELSE 'Pendente'
                    END AS up_to_date
                `)
      )
      .innerJoin('clients as cl', 'ch.client_id', 'cl.id');

    return chargesData;
  } catch (err) {
    throw new Error("Erro interno do servidor.");
  }
};

const listCharges = async (req, res) => {
  try {
    const chargesData = await getChargesData();

    return res.status(200).json(chargesData);
  } catch (err) {
    return res.status(500).json("Erro interno do servidor.");
  }
}

const updateCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, value, due_date, status } = req.body;

    const charge = await knex('charges').where({ id }).first();
    if (!charge) {
      return res.status(404).json("Cobrança não encontrada.");
    }
    await knex("charges").where({ id }).update({
      description,
      value,
      due_date,
      status,
    });

    const updatedCharge = await knex('charges as ch')
      .select(
        'ch.id',
        'ch.client_id',
        'cl.name as client_name',
        'ch.description',
        'ch.value',
        'ch.due_date',
        'ch.status',
        knex.raw(`
                    CASE
                        WHEN ch.status = 'pago' THEN 'Paga'
                        WHEN ch.status = 'pendente' AND ch.due_date < CURRENT_TIMESTAMP THEN 'Vencida'
                        ELSE 'Pendente'
                    END AS up_to_date
                `)
      )
      .innerJoin('clients as cl', 'ch.client_id', 'cl.id').where('ch.id', id).first();

    res.status(200).json(updatedCharge);
  } catch (error) {
    res.status(500).json("Falha ao atualizar a cobrança.");
  }

}

const deleteCharge = async (req, res) => {
  try {
    const { id } = req.params;

    const charge = await knex('charges').where({ id: id }).first();
    if (!charge) {
      return res.status(404).json("Cobrança não encontrada.");
    }
    if (charge.status === 'pago') {
      return res.status(400).json("Não se pode apagar cobranças pagas.");
    }
    if (charge.due_date < new Date()) {
      return res.status(400).json("Não se pode apagar cobranças vencidas.");
    }

    await knex("charges").where({ id }).del();


    res.status(200).json("Cobrança excluida com sucesso!");
  } catch (error) {
    res.status(500).json("Falha ao deletar cobraça.");
  }
}

module.exports = {
  createCharge,
  listCharges,
  updateCharge,
  deleteCharge,
  getClientCharge,
  getChargesData,
}