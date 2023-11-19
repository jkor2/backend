const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const router = require("./routes/index");
var app = express();

app.use(express.json());
app.use("/", router);
app.use(cors());

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
