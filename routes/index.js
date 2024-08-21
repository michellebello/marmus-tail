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

router.get("/", async (req, res) => {
  res.send({ title: "Express" });
});

router.post("/signup", async (req, res) => {
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
    res.redirect("/");
  }
});

router.post("/signin", async (req, res) => {
  const user = req.body["username"];
  const userPassword = req.body["password"];
  console.log(user);
  console.log(userPassword);
  //fetching user and password and adding it to the db
  try {
    const result = await db.query(
      "SELECT password FROM users WHERE username = $1",
      [user]
    );
    if (result.rows.length > 0) {
      const currUser = result.rows[0];
      const storedHashedPassword = currUser.password;
      bcrypt.compare(userPassword, storedHashedPassword, (err, valid) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (valid) {
            res.status(201).send("User successfully logged in");
          } else {
            res.send("Password does not match, try again");
          }
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("An error has occured, try again");
  }
});

export default router;
