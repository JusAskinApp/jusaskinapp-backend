const firebase = require("firebase/app");
const firestore = require("firebase/firestore");
const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const app = express();
// default options
app.use(cors(corsOptions));

const router = express.Router();

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MSG_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASURE_ID,
};

// Initialize Firebase
// const app2 = firebase.initializeApp(firebaseConfig);
admin.initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = admin.firestore();

router.get("/getUsers", (req, res) => {
  let users = [];
  // Reference the 'users' collection
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
router.get("/", (req, res) => {
  res.json(db);
});

router.post("/signup", function (req, res) {
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
app.use(express.json());             // for application/json
app.use(express.urlencoded());
app.use(router);
app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
