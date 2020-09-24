/* Import faunaDB sdk */
const faunadb = require('faunadb')
const getId = require('./utils/getId')
const q = faunadb.query


exports.handler = (event, context) => {
  console.log('Function `read-all-cards` invoked')
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: "fnAD2RsttSACB-rWArdacRo7dvrsYGglnhMvtOQn" //process.env.FAUNADB_SERVER_SECRET
  })
  const id = getId(event.path)
  console.log(`Function 'read-all-cards' invoked. Read id: ${id}`)
  return client.query(
    q.Paginate(q.Match(q.Index('cards_by_user'), id))) //q.Ref('indexes/all_cards')
    .then((response) => {
      const cardsRefs = response.data
      console.log('Cards refs', cardsRefs)
      console.log(`${cardsRefs.length} cards found`)
      const getAllCardsDataQuery = cardsRefs.map((ref) => {
        return q.Get(ref)
      })
      // then query the refs
      return client.query(getAllCardsDataQuery).then((ret) => {
        return {
          statusCode: 200,
          body: JSON.stringify(ret)
        }
      })
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
