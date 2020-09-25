/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query


exports.handler = (event, context) => {
  console.log('Function `get-user` invoked');
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: "fnAD2RsttSACB-rWArdacRo7dvrsYGglnhMvtOQn" //process.env.FAUNADB_SERVER_SECRET
  });
  const data = JSON.parse(event.body);
  console.log(data)
  return client.query(
    q.Paginate(
      q.Union(
        q.Match(
          q.Index('user_by_email_and_name'), data.email
        ),
        q.Match(
          q.Index('user_by_email_and_name'), data.name
        )
      )
    )
  ) //q.Ref('indexes/all_cards')
    .then((response) => {
      console.log('success', response.data)
      /* Success! return the response with statusCode 200 */
      return {
        statusCode: 200,
        body: JSON.stringify(response.data)
      }
    })
    .catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    });
};
