const sumValue = (data, value) => {
  const total_values = data.reduce((acumulator, item) => {
    if (item.up_to_date === value) {
      return acumulator + item.value
    }
    return acumulator
  }, 0)
  return total_values
}


const clientsByStatus = (data, value) => {
  const defaultersClients = []
  data.map((client) => {
    if (client.up_to_date === value) {
      return defaultersClients.push({
        id: client.id,
        name: client.name,
        cpf: client.cpf
      })
    }
  })
  return defaultersClients
}

const clients = (data, value) => {
  const client = []
  data.map((item) => {
    if (item.up_to_date === value) {
      return client.push(item)
    }
  })
  return client
}


module.exports = {
  sumValue,
  clients,
  clientsByStatus
}