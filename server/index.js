const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = require('express')();
const routes = require('./routes.js');

// Load settings from env vars
const PORT = process.env.PORT || 3001;
const SQL_USER = process.env.LOCKERS_SQL_USER || 'lockers';
const SQL_PASSWORD = process.env.LOCKERS_SQL_PASSWORD || 'no_password';
const API_KEY = process.env.LOCKERS_API_KEY || 'no_key';

const ROOT_PATH = '/lockersapi';

app.use((req, res, next) => {
  // Create a connection to the SQL server
  global.connection = mysql.createPool({
    host: 'localhost',
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: 'lockers2011',
  });
  next();
});

// Basic auth middleware
app.use((req, res, next) => {
  switch (req.url) {
    case `${ROOT_PATH}/summary`:
    case `${ROOT_PATH}/summary/`:
    case `${ROOT_PATH}/upsert`:
    case `${ROOT_PATH}/upsert/`:
    case `${ROOT_PATH}/reset`:
    case `${ROOT_PATH}/reset/`:
      if (req.headers.authorization !== API_KEY) {
        res.status(403).send('Unauthorized');
        return;
      } else {
        next();
      }
      break;
    default:
      next();
  }
});

// Parse body as JSON
app.use(bodyParser.json());

app.get('/lockersapi/ping', (req, res) => {
  res.status(200).send('Hello from the ESS Lockers API!');
});

app.get(`${ROOT_PATH}/test`, routes.test);
app.get(`${ROOT_PATH}/available`, routes.available);
app.get(`${ROOT_PATH}/summary`, routes.summary);
app.post(`${ROOT_PATH}/upsert`, routes.upsert);
app.post(`${ROOT_PATH}/new`, routes.create);
app.post(`${ROOT_PATH}/renew`, routes.renew);
app.post(`${ROOT_PATH}/deregister/code`, routes.code);
app.post(`${ROOT_PATH}/reset`, routes.reset);
app.delete(`${ROOT_PATH}/deregister/confirm`, routes.confirm);

app.listen(PORT, () => console.log('Listening on port', PORT));
