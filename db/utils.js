const { Client } = require("pg");

async function getClient() {
  const client = new Client(
    "postgres://zyheudmf:f3wNb1S27BYg_QVXxmo1Ig7vV_0W8Wxm@rain.db.elephantsql.com/zyheudmf"
  );
  await client.connect();
  return client;
}

module.exports = getClient;
