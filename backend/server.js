const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: "myuser",
  host: "postgres-service",
  database: "mydb",
  password: "mypassword",
  port: 5432,
});

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({ message: "Hello from express", time: result.rows[0] });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
