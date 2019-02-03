const sendmail = require('sendmail')();
const ENVIRONMENT = 'dev';

exports.sendConfirmation = (email, name, number) => {
  if (ENVIRONMENT === 'dev') {
    console.log('Env set to dev, not sending email');
    return;
  }

  sendmail({
    from: 'ess@engr.uvic.ca',
    to: email,
    subject: '[DO-NOT-REPLY] ESS Locker Registration',
    html: '<p>Hello there ' + name + ',</p>'+
    '<p>You have successfully registered locker ' + number + ' in the ELW.</p>'+
    '<p>You reservation will be valid until the beginning of next term, at which point you must renew it.</p>'+
    '<p>If you would like to free up the locker for someone else to use before '+
    'the start of next term, you may deregister it at the following link: </p>'+
    '<p>http://ess.uvic.ca/lockers/#/deregister</p>'
  }, function(err, reply) {
    return;
  });
};

exports.sendRenewalConf = (email, name, number) => {
  if (ENVIRONMENT === 'dev') {
    console.log('Env set to dev, not sending email');
    return;
  }

  sendmail({
    from: 'ess@engr.uvic.ca',
    to: email,
    subject: '[DO-NOT-REPLY] ESS Locker Renewal',
    html: '<p>Hello there ' + name + ',</p>'+
    '<p>You have successfully renewed locker ' + number + ' in the ELW.</p>'+
    '<p>You reservation will be valid until the beginning of next term, at which point you must renew it again.</p>'+
    '<p>If you would like to free up the locker for someone else to use before '+
    'the start of next term, you may deregister it at the following link: </p>'+
    '<p>http://ess.uvic.ca/lockers/#/deregister</p>'
  }, function(err, reply) {
    return;
  });
};

exports.sendDeregCode = (email, code) => {
  if (ENVIRONMENT === 'dev') {
    console.log('Env set to dev, not sending email');
    return;
  }

  sendmail({
    from: 'ess@engr.uvic.ca',
    to: email,
    subject: '[DO-NOT-REPLY] ESS Locker Deregistration',
    html: '<p>Hello there,</p>'+
    '<p>You are receiving this email because you requested a locker registration removal.</p>'+
    '<p>Your code is: ' + code + '</p>'+
    '<p>If you did not request this you may safely ignore this email.</p>'
  }, function(err, reply) {
    return;
  });
};

exports.sendDeregConf = (email, name, number) => {
  if (ENVIRONMENT === 'dev') {
    console.log('Env set to dev, not sending email');
    return;
  }

  sendmail({
    from: 'ess@engr.uvic.ca',
    to: email,
    subject: '[DO-NOT-REPLY] ESS Locker Deregistration',
    html: '<p>Hello there ' + name + ',</p>'+
    '<p>You have successfully deregistered locker ' + number + ' in the ELW.</p>'+
    '<p>Thank you for helping to ensure there are enough available lockers.</p>'
  }, function(err, reply) {
    return;
  });
};

exports.sendRenewalRequest = (email, name) => {
  sendmail({
    from: 'ESS <ess@engr.uvic.ca>',
    to: email,
    subject: '[DO-NOT-REPLY] Action Required: ESS Locker Reservation',
    html: '<p>Hello there ' + name + ',</p>'+
    '<p>You are receiving this email because you have a locker reservation in our system. '+
    'As you may know, at the beginning of each term we require all existing locker reservations to be renewed. '+
    'This is to reduce the number of abandoned/forgotten lockers and to help ensure that there are enough free '+
    'lockers for everyone. If you would like to continue using your locker, please visit the link below:</p>'+
    '<p>http://ess.uvic.ca/lockers/renew</p>'+
    '<p>If you no longer need your locker and would like to make it available this term, please remember '+
    'to remove your belongings and lock. Your reservation will automatically be removed if you do not renew it '+
    'within one week. If you do not renew your locker, your lock will be cut during reading break (Feb 18-22), and you '+
    'can retrieve your locker\'s contents from the ESS office (ELW 206). Items will be saved for a minimum '+
    'of two weeks after which they will be disposed of. If you are unable to make this deadline '+
    'please contact us (essbtec@uvic.ca) and we\'d be happy to hold on to your things longer.</p>'
  }, (err, reply) => {
    if (err) {
      console.log('[WARNING]: Error sending emails');
    }
  });
};
