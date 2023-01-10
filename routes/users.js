const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();
const app = express();
const db = admin.firestore();
router.use(express.json()); // for application/json
router.use(express.urlencoded());
router.post("/login", (req, res) => {
  db.collection("users")
    .where("email", "==", req.body.email)
    .where("password", "==", req.body.password)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("Not Found!");
        res.status(404);
      } else {
        console.log("Name and email match!");
        const docData = snapshot.docs[0].data();
        res.status(200).send(docData);
      }
    });
});

// POST route to add a new user
router.post("/signup", (req, res) => {
  db.collection("users")
    .where("email", "==", req.body.email)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
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
      } else {
        res.status(400).send("Email already exists");
      }
    });
});

module.exports = router;
