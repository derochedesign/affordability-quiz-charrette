const express = require('express');
const controller = require("./controller");
const port = 3000;

const app = express();

app.set("view engine", "ejs");

app.use(express.static("./public"));

controller(app);

app.listen(process.env.PORT || port, "192.168.0.154");
console.log(`listening on ${port}`);
