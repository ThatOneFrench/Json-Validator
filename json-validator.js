const glob = require('glob');
const fs = require('fs');

function validateJSON(jsonData) {
  try {
    var data = JSON.parse(jsonData);

    if (!data.hasOwnProperty('name')) {
      throw new Error('missing property "name".');
    }

    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}


glob('**/*.json', (err, files) => {
  if (err) {
    console.error('Cannot find any .json file', err);
    process.exit(1);
  }

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const isValid = validateJSON(content);
    if (!isValid) {
      console.error(`File ${file} is illegal.`);
      process.exit(1);
    }
  });

  console.log('All .json files pass the test.');
});
