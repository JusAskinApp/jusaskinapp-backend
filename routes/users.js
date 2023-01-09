const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();
const app = express();
const db = admin.firestore();
router.use(express.json());          // for application/json
router.use(express.urlencoded());
router.get("/", (req, res) => {
  let users = [];
  db.collection("users")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        users.push(doc.data());
      });
      res.status(200).send(users);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

// POST route to add a new user
router.post("/", (req, res) => {
  console.log(req.body);
  db.collection("users")
    .add({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      type: req.body.type,
    })
    .then((data) => {
      console.log(data.id);
      res.send(`user added ${JSON.stringify(data)}`);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});


module.exports = router;