const mongoose = require("mongoose");
const routes = require("./routes/index");
const express = require("express");
const app = express();
require("dotenv").config();
require("./models/Records");

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .on("open", () => {
    console.log("Mongoose connection open");
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });


app.use(express.json());
const server = app.listen(process.env.PORT, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

app.use("/", routes);
module.exports = app;