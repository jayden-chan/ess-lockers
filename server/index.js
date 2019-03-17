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
      if (req.headers.authorization !== API_KEY) {
        res.status(403).send('Unauthorized');
        return;
      }
      break;
    default:
      next();
  }
});

// Parse body as JSON
app.use(bodyParser.json());

app.get('/lockersapi/available', routes.available);

// app.get('/lockersapi/available', (req, res) => {
//   const query = sqlstring.format('SELECT number FROM ?? WHERE status = ?', [SQL_TABLE, 'open']);
//   connection.query(query, (error, results, fields) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send('Database query failed.');
//     } else {
//       res.status(200).json(results);
//     }
//   });
// });

app.get('lockersapi/summary', routes.summary);

// app.get('/lockersapi/summary', (req, res) => {
//   if (req.headers.authorization !== API_KEY) {
//     res.status(403).send('Unauthorized');
//     return;
//   }

//   const query = sqlstring.format('SELECT * FROM ??', SQL_TABLE);
//   connection.query(query, (error, results, fields) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send('Database query failed.');
//     } else {
//       res.status(200).json(results);
//     }
//   });
// });

app.post('/lockersapi/upsert', routes.upsert);
// app.post('/lockersapi/upsert', (req, res) => {
//   if (req.headers.authorization !== API_KEY) {
//     res.status(403).send('Unauthorized');
//     return;
//   }

//   if (req.body.name !== ''
//     && req.body.email !== ''
//     && req.body.locker !== ''
//     && req.body.status != '') {
//     const query1 = sqlstring.format(
//       'UPDATE ?? SET name = ?, email = ?, submitted = NOW(), status = ? WHERE number = ?',
//       [SQL_TABLE, req.body.name, req.body.email, req.body.status, req.body.number]);

//     connection.query(query1, (error, results, fields) => {
//       if (error) {
//         console.log(error);
//         res.status(500).send('An internal server error occured');
//       } else {
//         res.status(200).send('Locker updated');
//       }
//     });
//   } else {
//     res.status(400).send('One or more data fields were not filled. Please try again.');
//   }
// });

app.post('/lockersapi/new', routes.create);
// app.post('/lockersapi/new', (req, res) => {
//   if (req.body.name !== '' && req.body.email !== '' && req.body.locker !== '') {

//     const query1 = sqlstring.format('SELECT * FROM ?? WHERE email = ? AND status = ?',
//       [SQL_TABLE, req.body.email, 'closed']);

//     connection.query(query1, (error, results, fields) => {
//       if (results.length === 0) {
//         const query2 = sqlstring.format(
//           'UPDATE ?? SET name = ?, email = ?, submitted = NOW(), status = ? WHERE number = ?',
//           [SQL_TABLE, req.body.name, req.body.email, 'closed', req.body.locker]
//         );

//         connection.query(query2, (error, results, fields) => {
//           if (error) {
//             console.log(error);
//             res.status(500).send('Database query failed.');
//           } else {
//             emailer.sendConfirmation(req.body.email, req.body.name, req.body.locker);
//             res.status(200).send('Locker registered successfully');
//           }
//         });

//       } else {
//         res.status(403).send('Email is already registered to a locker');
//         return;
//       }
//     });
//   } else {
//     res.status(400).send('One or more data fields were not filled. Please try again.');
//   }
// });

app.post('/lockersapi/renew', routes.renew);
// app.post('/lockersapi/renew', (req, res) => {
//   if (req.body.email !== '') {
//     const query1 = sqlstring.format('SELECT name, number FROM ?? WHERE email = ? AND status = ?',
//       [SQL_TABLE, req.body.email, 'pending']);

//     connection.query(query1, (error, results1, fields) => {
//       if (error) {
//         console.log(error);
//         res.status(500).send('Database query failed.');
//       } else if (results1.length === 1) {

//         const query2 = sqlstring.format('UPDATE ?? SET status = ? WHERE status = ? AND email = ?',
//           [SQL_TABLE, 'closed', 'pending', req.body.email]);

//         connection.query(query2, (error, results2, fields) => {
//           if (error) {
//             console.log(error);
//             res.status(500).send('Database query failed.');
//           } else {
//             emailer.sendRenewalConf(req.body.email, results1[0].name, results1[0].number);
//             res.status(200).send('Locker renewed successfully');
//           }
//         });
//       } else {
//         res.status(400).send('Specified locker is not up for renewal at this time.');
//       }
//     });
//   } else {
//     res.status(400).send('One or more data fields were not filled. Please try again.');
//   }
// });

app.post('/lockersapi/deregister/code', routes.code);
// app.post('/lockersapi/deregister/code', (req, res) => {
//   if (req.body.number !== '' && req.body.email !== '') {
//     const query = sqlstring.format(
//       'SELECT email FROM ?? WHERE number = ? AND status = ?',
//       [SQL_TABLE, req.body.number, 'closed']
//     );

//     connection.query(query, (error, results, fields) => {
//       if (error) {
//         console.log(error);
//         res.status(500).send('Database query failed.');
//       } else if (results.length === 1 && results[0].email === req.body.email) {
//         const resetCode = Math.floor(100000 + Math.random() * 900000);

//         const query = sqlstring.format(
//           'UPDATE ?? SET reset_code = ? WHERE number = ? AND email = ?',
//           [SQL_TABLE, resetCode, req.body.number, req.body.email]
//         );

//         connection.query(query, (error, results, fields) => {
//           if (error) {
//             console.log(error);
//             res.status(500).send('Database query failed');
//           } else {
//             emailer.sendDeregCode(req.body.email, resetCode);

//             setTimeout(() => {
//               const query = sqlstring.format('UPDATE ?? SET reset_code = NULL', SQL_TABLE);
//               connection.query(query, (error, results, fields) => {
//                 if (error) {
//                   console.log(error);
//                   console.log('Reset codes not reset');
//                 }
//               });
//             }, RESET_TIMEOUT); // Reset the locker codes after 20 minutes

//             res.status(200).send('Locker reset code generated.');
//           }
//         });
//       } else {
//         res.status(400).send('Locker does not belong to this email.');
//       }
//     });
//   } else {
//     res.status(400).send('One or more data fields were not filled. Please try again.');
//   }
// });

app.delete('/lockersapi/deregister/confirm', routes.confirm);
// app.delete('/lockersapi/deregister/confirm', (req, res) => {
//   if (req.body.code !== '') {
//     const query1 = sqlstring.format(
//       'SELECT * FROM ?? WHERE reset_code = ?', [SQL_TABLE, req.body.code]
//     );

//     connection.query(query1, (error, results1, fields) => {
//       if (error) {
//         console.log(error);
//         res.status(500).send('Database query failed');
//       } else if (results1.length !== 1) {
//         res.status(400).send('Invalid reset code. Please try again later');
//       } else {

//         const query2 = sqlstring.format(
//           'UPDATE ?? SET reset_code = ?, status = ? WHERE reset_code = ?',
//           [SQL_TABLE, null, 'open', req.body.code]
//         );

//         connection.query(query2, (error, results2, fields) => {
//           if (error) {
//             console.log(error);
//             res.status(500).send('Database query failed');
//           } else {
//             emailer.sendDeregConf(results1.email, results1.name, results1.number);
//             res.status(200).send('Locker successfully deregistered');
//           }
//         });
//       }
//     });
//   } else {
//     res.status(400).send('Reset code not found in body');
//   }
// });

app.listen(PORT, () => console.log('Listening on port', PORT));
