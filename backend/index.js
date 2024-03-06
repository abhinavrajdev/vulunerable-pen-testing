const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const getClient = require("./db/utils");

const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 8000;

const jwtSecret = "123456";
var users = [];

app.get("/", (req, res) => {
  res.send("hello");
});

var client;

async function startSQL() {
  try {
    client = await getClient();
  } catch (e) {
    console.log(e);
  }
}
startSQL();
app.post("/signup", async (req, res) => {
  var jwtToken = jwt.sign({ email: req.body.email }, jwtSecret);

  const checkQuery = `SELECT * FROM usersdemon WHERE email = '${req.body.email}'`;
  const checkRes = await client.query(checkQuery);

  if (checkRes.rows.length == 0) {
    const createUserQuery =
      "INSERT INTO usersdemon (email, password, movieTickets) VALUES (" +
      "'" +
      req.body.email +
      "'" +
      ", " +
      "'" +
      req.body.password +
      "'" +
      ", 0)";
    await client.query(createUserQuery);
    res.status(200).json({
      success: true,
      authToken: jwtToken,
    });
  } else {
    res.status(403).json({
      success: false,
    });
  }
});

app.post("/signin", async (req, res) => {
  const signinQuery = `SELECT * FROM usersdemon WHERE email = '${req.body.email}'`;
  const SQLres = await client.query(signinQuery);

  console.log(SQLres.rows[0]);
  if (req.body.password == SQLres.rows[0].password) {
    var jwtToken = jwt.sign({ email: req.body.email }, jwtSecret);
    console.log("SUCCESS");
    res.status(200).json({
      balance: SQLres.rows[0].movietickets,
      success: true,
      authToken: jwtToken,
    });
  } else {
    res.status(403).json({
      success: false,
    });
  }
});

app.post("/validatecookie", async (req, res) => {
  try {
    const decodeStats = await jwt.verify(req.body.auth, jwtSecret);
    console.log(decodeStats);
    //   console.log(decode);
    console.log("here");

    console.log("there");
    const signinQuery = `SELECT * FROM usersdemon WHERE email = '${decodeStats.email}'`;
    const SQLres = await client.query(signinQuery);
    console.log("row:   ", SQLres.rows[0]);

    res.status(200).json({
      balance: SQLres.rows[0].movietickets,
      success: true,
      email: decodeStats.email,
    });
  } catch (e) {}
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
