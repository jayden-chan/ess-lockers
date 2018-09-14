const prompts = require('prompts');
const sqlstring = require('sqlstring');
const mysql = require('mysql');
const sendmail = require('sendmail')();

const SQL_USER = process.env.LOCKER_SQL_USER || 'lockers';
const SQL_PASSWORD = process.env.LOCKER_SQL_PASSWORD || 'no_password';

const main = async () => {
  let response = await prompts({
    type: 'text',
    name: 'choice',
    message: 'Are you sure you want to trigger the new term actions?\n\nThis will set all active registrations to \'pending\' mode\nand send everyone an email requesting registration renewal [Y/n]'
  });

  if(response.choice !== 'Y' && response.choice !== 'y') {
    console.log('Exiting');
    return;
  }

  const connection = mysql.createPool({
    host: 'localhost',
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: 'lockers2011',
  });

  console.log('Updating registration statuses...');
  const query = sqlstring.format('UPDATE lockers SET status = ? WHERE status = ?', ['pending', 'closed']);
  connection.query(query, (error, results, fields) => {
    if(error) {
      console.log('[WARNING]: Error occurred while updating statuses:\n');
      console.log(error);
      console.log('\n\n[WARNING]: It is likely that the lockers database is mildly broken right now.');
      console.log('Please contact the current director of IT or the creator of this '+
        'script (jaydencn7@gmail.com) to get it fixed');
    }
    else {
      console.log('Done');

      const query2 = sqlstring.format('SELECT email, name FROM lockers WHERE status = ?', 'pending');
      connection.query(query2, (error, results, fields) => {
        if(error) {
          console.log('[WARNING]: Error occurred while updating statuses:\n');
          console.log(error);
          console.log('\n\n[WARNING]: It is likely that the lockers database is mildly broken right now.');
          console.log('Please contact the current director of IT or the creator of this '+
            'script (jaydencn7@gmail.com) to get it fixed');
        } else {
          console.log('Sending emails. This may take a while...');

          results.forEach(row => {
            sendmail({
              from: 'ESS <ess@engr.uvic.ca>',
              to: row.email,
              subject: '[DO-NOT-REPLY] Action Required: ESS Locker Reservation',
              html: '<p>Hello there ' + row.name + ',</p>'+
              '<p>You are recieving this email because you have a locker reservation in our system.</p>'+
              '<p>As you may know, at the beginning of each term we require all existing locker reservations to be renewed. '+\
              'This is to reduce the number of abandoned/forgotten lockers and to help ensure that there are enough free '+
              'lockers for everyone. If you would like to continue using your locker, please visit the link below:</p>'+
              '<p>http://ess.uvic.ca/lockers/renew</p>'+
              '<p>If you no longer need your locker and would like to make it available this term, please remember '+
              'to remove your belongings and lock. Your reservation will automatically be removed if you do not renew it '+
              'within one week. If you do not renew your locker, your lock will be cut at the end of the month, and you '+
              'can retrieve your locker\'s contents from the ESS office (ELW B206). Items will be saved for a minimum '+
              'of four months after which they will be disposed of. If you are unable to make this deadline '+
              'please contact us and we\'d be happy to hold on to your things longer.</p>'
            }, function(err, reply) {
              return;
            });
          });
        }
      });
    }
  });
}

main();
