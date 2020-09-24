/* Api methods to call /functions */

const create = (data) => {
  return fetch('/.netlify/functions/create-card', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAll = (userID) => {
  return fetch(`/.netlify/functions/read-all-cards/${userID}`,{
    method: 'POST',
  }).then((response) => {
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

const createUser = (data) => {
  return fetch('/.netlify/functions/create-user', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const getUser = (data) => {
  console.log(`get user ${data.name} ${data.email}`)
  return fetch('/.netlify/functions/get-user',{
    body: JSON.stringify(data),
    method: 'POST'
  }).then((response) => {
    return response.json()
  })
}

export default {
  create: create,
  readAll: readAll,
  delete: deleteCard,
  getUser: getUser,
  createUser: createUser
}
