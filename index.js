const firebase = require("firebase/app");
const firestore = require("firebase/firestore");

const cors = require("cors");
const express = require("express");

require("dotenv").config()

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
  apiKey: process.env.API_KEY ,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROCESS_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MSG_ID,
  appId: process.env.APP_ID ,
  measurementId: process.env.MEASURE_ID,
};
  
// Initialize Firebase
const app2 = firebase.initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service

const db = firestore.getFirestore(app2);
const ref = firestore.collection(db, "users");

router.get("/", (req, res) => {
  res.json(db);
});

router.get("/getUsers", (req, res) => {
  getDocs(ref).then((querySnapshot) => {
    res.status(200).send(querySnapshot);
  });
});

// router.post("/upload", function (req, res) {
//   let sampleFile;
//   // let uploadPath;

//   firestore
//     .addDoc(ref, {
//       name: req.body.name,
//       base64: "asdad".toString(),
//       type: req.body.type,
//       author: req.body.author,
//       translator: req.body.translator,
//       rating: req.body.rating,
//       year: req.body.year,
//       pages: req.body.pages,
//       description: req.body.description,
//     })
//     .then((data) => {
//       console.log(data.id);
//       res.send(`File uploaded! ${JSON.stringify(data)}`);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err);
//     });
// });

app.use(router);
app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT)
})
