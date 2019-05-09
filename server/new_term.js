const prompts = require('prompts');
const sqlstring = require('sqlstring');
const mysql = require('mysql');
const emailer = require('./emailer.js');

const SQL_USER = process.env.LOCKER_SQL_USER || 'lockers';
const SQL_PASSWORD = process.env.LOCKER_SQL_PASSWORD || 'no_password';

const logError = (error, message) => {
  console.log(`[WARNING]: ${message}`);
  console.log();
  console.log(error);
  console.log();
  console.log();
  console.log('[WARNING]: It is possible that the lockers database is mildly broken right now.');
  console.log();
  console.log('Please contact the current director of IT or the creator of this '+
    'script (jaydencn7@gmail.com) to get it fixed');
};

const main = async () => {
  let response = await prompts({
    type: 'text',
    name: 'choice',
    message: 'Are you sure you want to trigger the new term actions?\n\nThis will set all active registrations to \'pending\' mode\nand send everyone an email requesting registration renewal [Y/n]'
  });

  if (response.choice !== 'Y' && response.choice !== 'y') {
    console.log('Exiting');
    return;
  }

  console.log('Connecting to database...');
  const connection = mysql.createPool({
    host: 'localhost',
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: 'lockers2011'
  });

};

main();
