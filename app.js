const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const router = require("./routes/index");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  // router
  res.send("Hello world");
});

console.log("Cors connected ");

app.get("/api", (req, res) => {
  res.json({ test: true });
});

mongoose.set("strictQuery", false);

const DB = process.env.DBLINK;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(DB);
  console.log("MongoDB is connected");
}

app.listen(port, () => console.log("App is listening on port 5000"));
