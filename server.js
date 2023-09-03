const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 4000;
const { default: initRoutes } = require("./src/api/route/index.js");
const { default: ConnectDatabase } = require("./src/config/database.config.js");
import "./src/api/listen/sub.redis";
export const rootPath = __dirname;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send("Hello");
});
ConnectDatabase();
initRoutes(app);

app.listen(PORT, () => {
  console.log("listening on " + PORT);
});
