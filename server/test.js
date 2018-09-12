const sendmail = require('sendmail')();

sendmail({
    from: 'no-reply@yourdomain.com',
    to: 'test@qq.com, test@sohu.com, test@163.com ',
    subject: 'test sendmail',
    html: 'Mail of test sendmail ',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});
