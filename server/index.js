const bodyParser = require('body-parser');
const sqlstring = require('sqlstring');
const mysql = require('mysql');
const sha256 = require('js-sha256').sha256;
const express = require('express');
const sendmail = require('sendmail')();

const app = express();
const PORT = process.env.PORT || 3000;
const RESET_TIMEOUT = process.env.LOCKER_RESET_TIME || 10000;
const SQL_USER = process.env.LOCKER_SQL_USER || 'lockers';
const SQL_PASSWORD = process.env.LOCKER_SQL_PASSWORD || 'no_password';
const SQL_TABLE = process.env.LOCKER_SQL_TABLE || 'lockers';

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
  if(req.headers.authorization === 'placeholder') {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
});

app.get('/lockersapi/available', (req, res) => {
  const query = sqlstring.format('SELECT number FROM ?? WHERE status = ?', [SQL_TABLE, 'open']);
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).send('Database query failed.');
    } else {
      res.status(200).send(JSON.stringify(results));
    }
  });
});

app.post('/lockersapi/new', (req, res) => {
  if (req.body.name !== '' && req.body.email !== '' && req.body.locker !== '') {

    const query1 = sqlstring.format('SELECT * FROM ?? WHERE email = ? AND status = ?',
      [SQL_TABLE, req.body.email, 'closed']);

    connection.query(query1, (error, results, fields) => {
      if(results.length === 0) {
        const query2 = sqlstring.format('UPDATE ?? SET name = ?, email = ?, submitted = NOW(), status = ? WHERE number = ?',
          [SQL_TABLE, req.body.name, req.body.email, 'closed', req.body.locker]);

        connection.query(query2, (error, results, fields) => {
          if (error) {
            console.log(error);
            res.status(500).send('Database query failed.');
          } else {
            sendmail({
              from: 'ess@engr.uvic.ca',
              to: req.body.email,
              subject: '[DO-NOT-REPLY] ESS Locker Registration',
              html: '<p>Hello there ' + req.body.name + ',</p>'+
              '<p>You have successfully registered locker ' + req.body.locker + ' in the ELW.</p>'+
              '<p>You reservation will be valid until the beginning of next term, at which point you must renew it.</p>'+
              '<p>If you would like to free up the locker for someone else to use before '+
              'the start of next term, you may deregister it at the following link: </p>'+
              '<p>http://ess.uvic.ca/lockers/deregister</p>'
            }, function(err, reply) {
              return;
            });
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

app.post('/lockersapi/renew', (req, res) => {
  if (req.body.email !== '') {
    const query1 = sqlstring.format('SELECT name, number FROM ?? WHERE email = ? AND status = ?',
      [SQL_TABLE, req.body.email, 'pending']);

    connection.query(query1, (error, results1, fields) => {
      if (error) {
        console.log(error);
        res.status(500).send('Database query failed.');
      } else if(results.length === 1) {

        const query2 = sqlstring.format('UPDATE ?? SET status = ? WHERE status = ? AND email = ?',
          [SQL_TABLE, 'closed', 'pending', req.body.email]);

        connection.query(query2, (error, results2, fields) => {
          if (error) {
            console.log(error);
            res.status(500).send('Database query failed.');
          } else {
            sendmail({
              from: 'ess@engr.uvic.ca',
              to: req.body.email,
              subject: '[DO-NOT-REPLY] ESS Locker Renewal',
              html: '<p>Hello there ' + results1.name + ',</p>'+
              '<p>You have successfully renewed locker ' + results1.number + ' in the ELW.</p>'+
              '<p>You reservation will be valid until the beginning of next term, at which point you must renew it again.</p>'+
              '<p>If you would like to free up the locker for someone else to use before '+
              'the start of next term, you may deregister it at the following link: </p>'+
              '<p>http://ess.uvic.ca/lockers/deregister</p>'
            }, function(err, reply) {
              return;
            });
            res.status(200).send('Locker renewed successfully');
          }
        });
      } else {
        res.status(400).send('Specified locker is not up for renewal at this time.');
      }
    });
  } else {
    res.status(400).send('One or more data fields were not filled. Please try again.');
  }
});

app.post('/lockersapi/deregister/code', (req, res) => {
  if (req.body.number !== '' && req.body.email !== '') {
    const query = sqlstring.format('SELECT email FROM ?? WHERE number = ?', [SQL_TABLE, req.body.number]);

    connection.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(500).send('Database query failed.');
      } else if (results.length === 1 && results[0].email === req.body.email) {
        const resetCode = Math.floor(100000 + Math.random() * 900000);

        const query = sqlstring.format('UPDATE ?? SET reset_code = ? WHERE number = ?',
          [SQL_TABLE, resetCode, req.body.number]);

        connection.query(query, (error, results, fields) => {
          if (error) {
            console.log(error);
            res.status(500).send('Database query failed');
          } else {
            sendmail({
              from: 'ess@engr.uvic.ca',
              to: req.body.email,
              subject: '[DO-NOT-REPLY] ESS Locker Deregistration',
              html: '<p>Hello there,</p>'+
              '<p>You are receiving this email because you requested a locker registration removal.</p>'+
              '<p>Your code is: ' + resetCode + '</p>'+
              '<p>If you did not request this you may safely ignore this email.</p>'
            }, function(err, reply) {
              return;
            });

            var timer = setTimeout(() => {
              const query = sqlstring.format('UPDATE ?? SET reset_code = NULL', SQL_TABLE);
              connection.query(query, (error, results, fields) => {
                if (error) {
                  console.log(error);
                  console.log('Reset codes not reset');
                }
              });
            }, RESET_TIMEOUT); // Reset the locker codes after 20 minutes

            res.status(200).send('Locker reset code generated.');
          }
        });
      } else {
        res.status(400).send('Locker does not belong to this email.');
      }
    });
  } else {
    res.status(400).send('One or more data fields were not filled. Please try again.');
  }
});

app.delete('/lockersapi/deregister/confirm', (req, res) => {
  if (req.body.code !== '') {
    const query1 = sqlstring.format('SELECT * FROM ?? WHERE reset_code = ?', [SQL_TABLE, req.body.code])
    connection.query(query1, (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(500).send('Database query failed');
      } else if (results.length !== 1) {
        res.status(400).send('Invalid reset code. Please try again later');
      } else {
        const query2 = sqlstring.format('UPDATE ?? SET reset_code = ?, status = ? WHERE reset_code = ?',
          [SQL_TABLE, null, 'open', req.body.code]);

        connection.query(query2, (error, results, fields) => {
          if (error) {
            console.log(error);
            res.status(500).send('Database query failed');
          } else {
            sendmail({
              from: 'ess@engr.uvic.ca',
              to: req.body.email,
              subject: '[DO-NOT-REPLY] ESS Locker Deregistration',
              html: '<p>Hello there ' + req.body.name + ',</p>'+
              '<p>You have successfully deregistered locker ' + req.body.number + ' in the ELW.</p>'+
              '<p>Thank you for helping to ensure there are enough available lockers.</p>'
            }, function(err, reply) {
              return;
            });
            res.status(200).send('Locker successfully deregistered');
          }
        });
      }
    });
  } else {
    res.status(400).send('Reset code not found in body');
  }
});

app.listen(PORT, () => console.log('Listening on port', PORT));
