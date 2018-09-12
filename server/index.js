const bodyParser = require('body-parser');
const sqlstring = require('sqlstring');
const mysql = require('mysql');
const sha256 = require('js-sha256').sha256;
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;
const RESET_TIMEOUT = process.env.LOCKER_RESET_TIME || 10000;
const SQL_USER = process.env.LOCKER_SQL_USER || 'lockers';
const SQL_PASSWORD = process.env.LOCKER_SQL_PASSWORD || 'no_password';

app.use((req, res, next) => {
  global.connection = mysql.createPool({
    host: 'localhost',
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: 'lockers2011',
  });
  next();
});

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  // Enabling CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.get('/api/available', (req, res) => {
  const query = sqlstring.format('SELECT number FROM lockers WHERE status = ?', 'open');
  connection.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).send('Database query failed.');
    } else {
      res.status(200).send(JSON.stringify(results));
    }
  });
});

app.post('/api/new', (req, res) => {
  if (req.body.name !== '' && req.body.email !== '' && req.body.locker !== '') {

    let alreadyRegistered = false;

    const query1 = sqlstring.format('SELECT * FROM lockers WHERE email = ?', req.body.email);
    connection.query(query1, (error, results, fields) => {
      if(results.length === 0) {
        const regid = sha256(req.body.name + req.body.email + req.body.locker);
        const query2 = sqlstring.format('UPDATE lockers SET name = ?, email = ?, submitted = NOW(), regid = ?, status = ? WHERE number = ?',
          [req.body.name, req.body.email, regid, 'closed', req.body.locker]);

        connection.query(query2, (error, results, fields) => {
          if (error) {
            res.status(500).send('Database query failed.');
          } else {
            res.status(200).send('Locker registered successfully');
          }
        });

      } else {
        res.status(403).send('Email is already registered to a locker');
      }
    });
  } else {
    res.status(400).send('One or more data fields were not filled. Please try again.');
  }
});

app.post('/api/renew', (req, res) => {
  if (req.body.email !== '') {
    const query = sqlstring.format('UPDATE lockers SET status = ? WHERE status = ? AND email = ?',
      ['closed', 'pending', req.body.email]);

    connection.query(query, (error, results, fields) => {
      if (error) {
        res.status(500).send('Database query failed.');
      } else {
        res.status(200).send('Locker renewed successfully');
      }
    });
  } else {
    res.status(400).send('One or more data fields were not filled. Please try again.');
  }
});

app.post('/api/deregister/code', (req, res) => {
  if (req.body.number !== '' && req.body.email !== '') {
    const query = sqlstring.format('SELECT email FROM lockers WHERE number = ?', req.body.number);
    connection.query(query, (error, results, fields) => {
      if (error) {
        res.status(500).send('Database query failed.');
      } else if (results.length === 1 && results[0].email === req.body.email) {
        const resetCode = Math.floor(100000 + Math.random() * 900000);
        const query = sqlstring.format('UPDATE lockers SET reset_code = ? WHERE number = ?',
          [resetCode, req.body.number]);

        connection.query(query, (error, results, fields) => {
          if (error) {
            res.status(500).send('Database query failed');
          } else {
            res.status(200).send('Locker reset code generated.');
          }
        });

        var timer = setTimeout(() => {
          const query = sqlstring.format('UPDATE lockers SET reset_code = NULL');
          connection.query(query, (error, results, fields) => {
            if (error) {
              console.log('Reset codes not reset');
            }
          });
        }, RESET_TIMEOUT); // Reset the locker codes after 20 minutes
      } else {
        res.status(400).send('Locker does not belong to this email.');
      }
    });
  } else {
    res.status(400).send('One or more data fields were not filled. Please try again.');
  }
});

app.delete('/api/deregister/confirm', (req, res) => {
  if (req.body.code !== '') {
    const query = sqlstring.format('UPDATE lockers SET reset_code = ?, status = ? WHERE reset_code = ?',
      [null, 'open', req.body.code]);

    connection.query(query, (error, results, fields) => {
      if (error) {
        res.status(500).send('Database query failed');
      } else {
        res.status(200).send('Locker successfully deregistered');
      }
    });
  } else {
    res.status(400).send('Reset code not found in body');
  }
});

app.listen(PORT, () => console.log('Listening on port', PORT));
