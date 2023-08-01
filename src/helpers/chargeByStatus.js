const knex = require("../database/knexConfig");

const controlValues = {

  totalPaidChargesValue: knex('charges')
    .sum('value as total')
    .where('status', '=', 'pago')
    .first(),

  totalOverdueChargesValue: knex('charges')
    .select()
    .sum('value as total')
    .whereRaw('due_date < NOW() and status = ?', ['pendente'])
    .first(),

  totalExpectedChargesValue: knex('charges')
    .select()
    .sum('value as total')
    .whereRaw('due_date > NOW() and status = ?', ['pendente'])
    .first(),

  AllclientsPaidcharges: knex('clients')
    .select('clients.*')
    .join('charges', 'clients.id', '=', 'charges.client_id')
    .where('charges.status', 'pago'),

  AllClientsOverdueCharges: knex('clients')
    .select('clients.*')
    .join('charges', 'clients.id', '=', 'charges.client_id')
    .whereRaw('due_date < NOW() and status = ?', ['pendente']),

  AllClientsExpectedCharges: knex('clients')
    .select('clients.*')
    .join('charges', 'clients.id', '=', 'charges.client_id')
    .whereRaw('due_date > NOW() and status = ?', ['pendente']),

  amountPaidChargesValue: knex('charges')
    .where('status', '=', 'pago'),

  amountExpectedCharges: knex('charges')
    .whereRaw('due_date > NOW() and status = ?', ['pendente']),

  amountOverdueCharges: knex('charges')
    .whereRaw('due_date < NOW() and status = ?', ['pendente']),

  allCharges: knex('charges as ch')
    .select(
      'ch.id',
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
    .innerJoin('clients as cl', 'ch.client_id', 'cl.id'),

  allClients: knex('clients as c')
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
    .groupBy('c.id')


}

module.exports = {
  controlValues
}