const express = require('express');
const controller = require("./controller");
const port = 3041;

const app = express();

app.set("view engine", "ejs");

app.use(express.static("./public"));

controller(app);

app.listen(process.env.PORT || port, "10.9.192.23");
console.log(`listening on ${port}`);
