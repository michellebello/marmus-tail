import { Router } from "express";
import pg from "pg";
import bcrypt from "bcrypt";

var router = Router();

const saltRounds = 10;
const db = new pg.Client({
  user: "postgres",
  port: 5432,
  database: "school",
  password: "Atlas12345",
  host: "localhost",
});

db.connect();

router.get("/", (req, res) => {
  res.send({ title: "Express" });
});

router.post("/", async (req, res) => {
  const user = req.body["username"];
  const userPassword = req.body["password"];
  //fetching user and password and adding it to the db
  try {
    const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
    console.log({ hashedPassword });

    await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      user,
      hashedPassword,
    ]);
    res.status(201).send("User successfully registered");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error has occured");
  }
});

export default router;
