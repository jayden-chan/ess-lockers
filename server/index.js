const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = require('express')();
const routes = require('./routes.js');

// Load settings from env vars
const PORT = process.env.PORT || 3001;
const SQL_USER = process.env.LOCKERS_SQL_USER || 'lockers';
const SQL_PASSWORD = process.env.LOCKERS_SQL_PASSWORD || 'no_password';
const API_KEY = process.env.LOCKERS_API_KEY || 'no_key';

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
    case '/lockersapi/summary':
    case '/lockersapi/upsert':
    case '/lockersapi/summary/':
    case '/lockersapi/upsert/':
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

app.get('/lockersapi/test', routes.test);
app.get('/lockersapi/available', routes.available);
app.get('/lockersapi/summary', routes.summary);
app.post('/lockersapi/upsert', routes.upsert);
app.post('/lockersapi/new', routes.create);
app.post('/lockersapi/renew', routes.renew);
app.post('/lockersapi/deregister/code', routes.code);
app.delete('/lockersapi/deregister/confirm', routes.confirm);

app.listen(PORT, () => console.log('Listening on port', PORT));
