const sendmail = require('sendmail')();

const contentful = require('contentful')
  .createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

const templateReplace = (text, name, number, code) => {
  return text
    .replace(/{{name}}/, name || '')
    .replace(/{{number}}/, number || '')
    .replace(/{{code}}/, code || '');
};

const htmlFormat = (text) => {
  return text.split('\n').reduce((acc, curr) => {
    return curr !== '' ? acc + `<p>${curr}</p>` : acc;
  }, '');
};

exports.getContentfulEntry = async (template) => {
  return await contentful.getEntry(template);
};

exports.send = (template, email, name, number, code) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Env not set to production, not sending email');
    return;
  }

  contentful
    .getEntry(template)
    .then(entry => {
      const greeting = `<p>${templateReplace(entry.fields.greeting, name, number, code)}</p>`;
      const body = htmlFormat(templateReplace(entry.fields.body, name, number, code));
      const footer = `<p>${templateReplace(entry.fields.footer || '', name, number, code)}</p>`;

      sendmail({
        from: 'ESS <ess@engr.uvic.ca>',
        to: email,
        subject: entry.fields.subject,
        html: `${greeting}\n${body}\n${footer}`,
      });
    })
    .catch(err => console.log(err));
};

exports.sendConfirmation = (email, name, number) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Env not set to production, not sending email');
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
  });
};

exports.sendRenewalConf = (email, name, number) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Env not set to production, not sending email');
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
  });
};

exports.sendDeregCode = (email, code) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Env not set to production, not sending email');
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
  });
};

exports.sendDeregConf = (email, name, number) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Env not set to production, not sending email');
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
  });
};

exports.sendRenewalRequest = (entry, email, name) => {
  const greeting = `<p>${templateReplace(entry.fields.greeting, name)}</p>`;
  const body = htmlFormat(templateReplace(entry.fields.body, name));
  const footer = `<p>${templateReplace(entry.fields.footer || '', name)}</p>`;

  sendmail({
    from: 'ESS <ess@engr.uvic.ca>',
    to: email,
    subject: entry.fields.subject,
    html: `${greeting}\n${body}\n${footer}`,
  });
};

exports.sendResetSucccess = (email) => {
  sendmail({
    from: 'ESS <ess@engr.uvic.ca>',
    to: email,
    subject: '[IMPORTANT]: ESS Semester Reset Success',
    html: `
    <p>Hello there</p>

    <p>
      Recently you submitted a request to reset the lockers system
      for this semester. This email is to let you know that that request
      was successful; closed lockers have been set to pending and those with
      pending lockers are receiving emails requesting them to renew. The emails
      might take a few minutes to finish sending.
    </p>

    <p>
      When you're ready, cut the locks of those with 'pending' status, then press
      the 'set pending lockers to open' button in the admin interface. Remember that
      you can search by status in the admin interface to make it easier to see which
      lockers are pending.
    </p>
    `,
  });
};
