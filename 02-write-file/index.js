const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const { stdin, stdout } = process;

console.log('Hi, please write ur text:');
stdin.on('data', chunk => {
  let data = chunk.toString().trim();
  if (data !== 'exit') {
    output.write(chunk);
  } else {
    process.exit();
  }
});

process.on('SIGINT', () => process.exit() );
process.on('exit', () => stdout.write('\nGood luck!') );