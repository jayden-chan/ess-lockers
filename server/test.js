const contentful = require('contentful');
const client = contentful.createClient({
  space: 'ixvlauwykl2e',
  accessToken: 'f6943fc41672066bc635c4e7be87397a5fcfa95d74659f1b242cb48059c372a6',
});

const templateReplace = (text) => {
  return text
    .replace(/{{name}}/, 'Jason Chen')
    .replace(/{{number}}/, 45)
    .replace(/{{code}}/, 123456);
};

const htmlFormat = (text) => {
  return text.split('\n').reduce((acc, curr) => {
    return curr !== '' ? acc + `<p>${curr}</p>\n` : acc;
  }, '');
};

client
  .getEntry('5c10q7pyNgCgJMW562H9G9')
  .then(entry => {
    console.log(entry.fields.subject);
    console.log(templateReplace(entry.fields.greeting));
    console.log(htmlFormat(templateReplace(entry.fields.body)));
    console.log(entry.fields.footer || '');
  })
  .catch(err => console.log(err));
