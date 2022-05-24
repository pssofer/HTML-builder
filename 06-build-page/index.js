const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'project-dist');

fs.mkdir(folderPath, { recursive: true }, (err) => {
  if (err) throw err;
});

const inputHTML = fs.createReadStream(path.join(__dirname, 'template.html'));
const outputHTML = fs.createWriteStream(path.join(folderPath, 'index.html'));
const elementsFolder = path.join(__dirname, 'components');

let pattern = '';

inputHTML.on('data', (chunk) => pattern += chunk );
inputHTML.on('end', () => {
  getComponents(pattern);
  getStyles();
  copyDir();
});    

function getComponents(content) {
  if(content.indexOf('{{') !== -1) {
    const start = content.indexOf('{{');
    const end = content.indexOf('}}');
    const elementReadStream = fs.createReadStream(path.join(elementsFolder, `${content.slice(start + 2, end)}.html`), 'utf-8');
    let elementContent = '';
    elementReadStream.on('data', (chunk) => elementContent += chunk);
    elementReadStream.on('end', () => {
      if (content.slice(start, end + 2) === '{{header}}' || content.slice(start, end + 2) === '{{footer}}') {
        elementContent = elementContent.split('\r\n').join('\r\n    ');
      } else {
        elementContent = elementContent.split('\r\n').join('\r\n      ');
      }
      content = content.replace(content.slice(start, end + 2), elementContent);
      getComponents(content);
    });
  } else {
    outputHTML.write(content);
  }
}

function getStyles() {
  const stylesFolder = path.join(__dirname, 'styles');

  fs.unlink(path.join(__dirname, 'project-dist', 'style.css'), (err, file) => {
    if (file) {
      if (err) throw err;
    }
  });

  fs.readdir(stylesFolder, {withFileTypes: true}, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(file => {
        if (file.isFile() & path.extname(file.name) === '.css') {
          const input = fs.createReadStream(path.join(stylesFolder, file.name));
          let array = [];
          input.on('data', chunk => array.push(chunk.toString()));
          input.on('end', () => fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), array.join(''), err => {
            if (err) throw err;
          }));        
        }
      });
    }
  });
}

function copyDir() {
  const filesPath = path.join(__dirname, 'assets');
  const filesCopyPath = path.join(__dirname, 'project-dist', 'assets');


  fs.mkdir(filesCopyPath, { recursive: true }, (err) => {
    if (err) throw err;
    removeDir(filesCopyPath);
    copyFiles(filesPath, filesCopyPath);
  });

  function removeDir(folderPath) {
    fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(file => {
          if (file.isFile()) {
            fs.unlink(path.join(folderPath, file.name), err => {
              if(err) throw err;   
            });
          } else {
            removeDir(path.join(folderPath, file.name));
          } 
        });
      }
    });
  }

  function copyFiles(folderPath, copyPath) {
    fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(file => {
          if (file.isFile()) {
            fs.copyFile(path.join(folderPath, file.name), path.join(copyPath, file.name), err => {
              if(err) throw err;
            });
          } else {
            fs.mkdir(path.join(filesCopyPath, file.name), { recursive: true }, (err) => {
              if (err) throw err;
              copyFiles(path.join(folderPath, file.name), path.join(copyPath, file.name));
            });
          }
        }); 
      }
    });
  }
}