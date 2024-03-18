const fs = require('fs').promises;
const path = require('path');

const requiredProperties = ['age', 'name', 'height', 'company'];

const findMissingProperties = (json) => {
  return requiredProperties.filter(prop => !json.hasOwnProperty(prop));
};

const checkPropertiesRecursively = async (dir) => {
  const errors = [];
  const entities = await fs.readdir(dir, { withFileTypes: true });

  for (const entity of entities) {
    const fullPath = path.join(dir, entity.name);
    if (entity.isDirectory()) {
      const subDirErrors = await checkPropertiesRecursively(fullPath);
      errors.push(...subDirErrors);
    } else if (entity.isFile() && path.extname(entity.name) === '.json') {
      try {
        const data = await fs.readFile(fullPath, 'utf8');
        const json = JSON.parse(data);
        const missingProperties = findMissingProperties(json);
        if (missingProperties.length > 0) {
          errors.push(`\nFile ${fullPath} missing the following properties: ${missingProperties.join(', ')}.`);
        }
      } catch (error) {
        errors.push(`\Syntax error in ${fullPath}: ${error.message}`);
      }
    }
  }

  return errors;
};


const startDirectory = 'json';
checkPropertiesRecursively(startDirectory)
  .then(errors => {
    if (errors.length > 0) {
      console.log('Issues found:');
      errors.forEach(error => console.log(error));
    } else {
      console.log('All check passed.');
    }
  })
  .catch(error => {
    console.error('A problem occurred while checking files:', error.message);
  });
