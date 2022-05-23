const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const styles = path.join(__dirname, 'styles');

fs.readdir(styles, { withFileTypes: true }, (error, result) => {
  if (error) return console.error(error.message);
  result.forEach(file => {
    if (path.extname(file.name) === '.css') {
      fs.readFile(path.join(styles, file.name), (error, data) => {
        if (error) return console.error(error.message);
        fs.createWriteStream(path.join(projectDist, 'bundle.css')).write(data);
      });
    }
  });
  console.log('Bundle.css created');
});