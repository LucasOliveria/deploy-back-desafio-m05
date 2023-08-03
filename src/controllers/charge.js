const knex = require("../database/knexConfig");
const { clients } = require('../helpers/charges')

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
    console.error(error);
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
    console.error(error);
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
const paidCharges = async (req, res) => {
  try {
    const chargesData = await getChargesData();
    const allData = clients(chargesData, 'Paga')

    return res.status(200).json(allData);
  } catch (err) {
    return res.status(500).json("Erro interno do servidor.");
  }
};
const unpaidCharges = async (req, res) => {
  try {
    const chargesData = await getChargesData();
    const allData = clients(chargesData, 'Vencida')

    return res.status(200).json(allData);
  } catch (err) {
    return res.status(500).json("Erro interno do servidor.");
  }
}
const pendingCharges = async (req, res) => {
  try {
    const chargesData = await getChargesData();
    const allData = clients(chargesData, 'Pendente')

    return res.status(200).json(allData);
  } catch (err) {
    return res.status(500).json("Erro interno do servidor.");
  }
}



/*
const updateCharge = async (req, res) => {
    try {
        const { id, description, value, due_date, status } = req.body;
        await knex("charges").where({ id }).update({
            description,
            value,
            due_date,
            status,
        });
        const updatedCharge = await knex("charges").where({ id }).first();
        res.status(200).json(updatedCharge);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update charge." });
    }

}

const deleteCharge = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCharge = await knex("charges").where({ id }).del();
        res.status(200).json({ id: deletedCharge[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete charge." });
    }
}

const getCharge = async (req, res) => {
    try {
        const { id } = req.params;
        const charge = await knex("charges").where({ id }).first();
        if (charge) {
            res.json(charge);
        } else {
            res.status(404).json({ error: "Charge not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get charge." });
    }
}
 
 
*/


module.exports = {
  createCharge,
  listCharges,
  //updateCharge,
  //deleteCharge,
  //getCharge,
  getClientCharge,
  paidCharges,
  unpaidCharges,
  pendingCharges,
  getChargesData,
}