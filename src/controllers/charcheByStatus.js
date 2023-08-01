const knex = require("../database/knexConfig");

const { clients, clientsByStatus } = require('../helpers/charges')
const { controlValues } = require('../helpers/chargeByStatus')

const listChargesBystatus = async (req, res) => {

  try {
    const dataClients = await controlValues.allClients
    const dataCharges = await controlValues.allCharges

    const paidCharges = await controlValues.totalPaidChargesValue
    const overdueCharges = await controlValues.totalOverdueChargesValue
    const expectedCharges = await controlValues.totalExpectedChargesValue

    const amountPaidCharges = await controlValues.amountPaidChargesValue
    const amountExpectedCharges = await controlValues.amountExpectedCharges
    const amountOverdueCharges = await controlValues.amountOverdueCharges

    const interfaceSumValues = {
      totalChargeAmountPerStatus: {
        paid_charges: Number(paidCharges.total),
        overdue_charges: Number(overdueCharges.total),
        expected_charges: Number(expectedCharges.total),
      },
      clients: {
        clientsPaidcharges: clients(dataCharges, 'Paga'),
        clientsOverdueCharges: clients(dataCharges, 'Vencida'),
        clientsExpectedCharges: clients(dataCharges, 'Pendente')
      },
      amountChargesPerStatus: {
        amountPaidCharges: amountPaidCharges.length,
        amountExpectedCharges: amountExpectedCharges.length,
        amountOverdueCharges: amountOverdueCharges.length
      },
      upToDateAndDefaulterclients: {
        numberUpToDateClients: clientsByStatus(dataClients, true).length,
        numberDefaulterClients: clientsByStatus(dataClients, false).length,
        upToDateClients: clientsByStatus(dataClients, true),
        defaulterClients: clientsByStatus(dataClients, false)
      }
    }
    return res.status(200).json(interfaceSumValues)
  } catch (error) {
    return res.status(500).json("Erro interno do servidor.")
  }
}


module.exports = listChargesBystatus