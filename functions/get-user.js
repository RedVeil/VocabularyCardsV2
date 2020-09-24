/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query


exports.handler = (event, context) => {
  console.log('Function `get-user` invoked')
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: "fnAD2RsttSACB-rWArdacRo7dvrsYGglnhMvtOQn" //process.env.FAUNADB_SERVER_SECRET
  })
  const data = JSON.parse(event.body)
  return client.query(
    q.Paginate(q.Union(
      q.Match(q.Index('user_by_email_and_name'), data.email),
      q.Match(q.Index('user_by_email_and_name'), data.mail))) //q.Ref('indexes/all_cards')
    .then((response) => {
      const userRefs = response.data
      console.log('User refs', userRefs)
      console.log(`${userRefs.length} users found`)
      const getAllUserDataQuery = userRefs.map((ref) => {
        return q.Get(ref)
      })
      // then query the refs
      return client.query(getAllUserDataQuery).then((ret) => {
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
