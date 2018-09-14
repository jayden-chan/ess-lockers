// const sendmail = require('sendmail')();
const ENVIRONMENT = 'dev';

exports.sendConfirmation = (email, name, number) => {
  if(ENVIRONMENT === 'dev') {
    console.log('Env set to dev, not sending email');
    return;
  }

  sendmail({
    from: 'ess@engr.uvic.ca',
    to: email,
    subject: '[DO-NOT-REPLY] ESS Locker Registration',
    html: '<p>Hello there ' + name + ',</p>'+
    '<p>You have successfully registered locker ' + locker + ' in the ELW.</p>'+
    '<p>You reservation will be valid until the beginning of next term, at which point you must renew it.</p>'+
    '<p>If you would like to free up the locker for someone else to use before '+
    'the start of next term, you may deregister it at the following link: </p>'+
    '<p>http://ess.uvic.ca/lockers/#/deregister</p>'
  }, function(err, reply) {
    return;
  });
}

exports.sendRenewalConf = (email, name, number) => {
  if(ENVIRONMENT === 'dev') {
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
}

exports.sendDeregCode = (email, code) => {
  if(ENVIRONMENT === 'dev') {
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
}

exports.sendDeregConf = (email, name, number) => {
  if(ENVIRONMENT === 'dev') {
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
}
