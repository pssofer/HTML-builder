const fs = require('fs');
const path = require('path');


fs.readdir(('./03-files-in-folder/secret-folder/'), {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    console.log('\nFiles:');
    files.forEach(file => {
      if (file.isFile()) {
        let fileTitle = file.name.split('.')[0];
        let fileExtention = (path.extname(file.name)).slice(1);
  
        fs.stat(path.join(('./03-files-in-folder/secret-folder/'), file.name), (error, stats) => {
          if (error) { 
            console.log(error); 
          } else {
            console.log(`${fileTitle} - ${fileExtention} - ${stats.size/1000}kb`);
          }
        });
      }
    });
  }
});




