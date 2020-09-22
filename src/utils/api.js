/* Api methods to call /functions */

const create = (data) => {
  return fetch('/.netlify/functions/create-card', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAll = () => {
  return fetch('/.netlify/functions/read-all-cards').then((response) => {
    return response.json()
  })
}

const deleteCard = (cardId) => {
  return fetch(`/.netlify/functions/delete-card/${cardId}`, {
    method: 'POST',
  }).then(response => {
    return response.json()
  })
}

export default {
  create: create,
  readAll: readAll,
  delete: deleteCard,
}
