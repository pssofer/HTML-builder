const fs = require('fs');
const path = require('path');

fs.rm(__dirname + '/files-copy/', { recursive: true, force: true }, () => {
  fs.mkdir(__dirname + '/files-copy/', () => {
    fs.readdir(__dirname + '/files', (err, files) => {
      files.forEach(file => {
        const readStream = fs.createReadStream(__dirname + `/files/${file}`, {encoding: 'utf8'});
        const writeStream = fs.createWriteStream(__dirname + `/files-copy/${file}`, {encoding: 'utf8'});
        readStream.on('data', (data) => {
          writeStream.write(data);
        });
      });
    });
  });
});
