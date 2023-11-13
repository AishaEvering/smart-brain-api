const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex");
const dotenv = require("dotenv").config();
const register = require("./controllers/register");
const signin = require("./controllers/signin.js");
const profile = require("./controllers/profile.js");
const email = require("./controllers/email.js");
const imgProcessor = require("./controllers/imgProcessor.js");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "aisha",
    password: "",
    database: "smart-brain",
  },
});

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("success");
});

app.post("/signin", signin.handleSignIn(db, bcrypt));

app.post("/register", register.handleRegister(db, bcrypt));

app.get("/profile/:id", profile.handleProfileGet(db));

app.post("/updatepassword", profile.handleUpdatePassword(db, bcrypt));

app.post("/update", profile.handleProfileUpdate(db));

app.post("/sendemail", email.handleSendPasswordRecoveryEmail());

app.post("/checkemail", profile.handleProfileGetByEmail(db));

app.put("/entries", imgProcessor.handleGetEntries(db));

app.post(
  "/findfaces",
  imgProcessor.handleGetModelDataWithImageUrl(
    process.env.CLARIFAI_FACE_DETECTION_MODEL_ID,
    process.env.CLARIFAI_PAT
  )
);

app.post(
  "/colors",
  imgProcessor.handleGetModelDataWithImageUrl(
    process.env.CLARIFAI_COLOR_DETECTION_MODEL_ID,
    process.env.CLARIFAI_PAT
  )
);

app.post(
  "/defaultfindfaces",
  imgProcessor.handleGetModelDataWithLocalImg(
    process.env.CLARIFAI_FACE_DETECTION_MODEL_ID,
    process.env.CLARIFAI_PAT
  )
);

app.post(
  "/defaultcolors",
  imgProcessor.handleGetModelDataWithLocalImg(
    process.env.CLARIFAI_COLOR_DETECTION_MODEL_ID,
    process.env.CLARIFAI_PAT
  )
);

app.get("/default", (req, res) => {
  res.sendFile(__dirname + "/public/South-Park.webp");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
