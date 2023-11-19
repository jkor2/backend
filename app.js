const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const router = require("./routes/index");
var app = express();

app.use(cors());
app.use(express.json());
app.use("/", (req, res) => {
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
app.listen(5000, () => console.log("App is listening on port 5000"));
