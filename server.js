const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const { default: initRoutes } = require("./src/api/route/index.js");
const { default: ConnectDatabase } = require("./src/config/database.config.js");
import "./src/api/listen/sub.redis";
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
ConnectDatabase();
initRoutes(app);

app.listen(4000, () => {
  console.log("listening on 4000");
});
