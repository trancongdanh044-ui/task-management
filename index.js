const express = require('express');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const database = require('./config/database');
const routesApiVer1 = require("./api/v1/routes/index.route");
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(cookieParser("DAKDHADAHPAD"));

database.connect();

// parse application/json/
app.use(bodyParser.json());

// RouterVer1
routesApiVer1(app);

app.listen(port, ()=>{
  console.log(`Example is listening on port ${port}`);
});

