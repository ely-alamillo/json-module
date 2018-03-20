const fs = require('fs');
const root = require('app-root-path');
const exec = require('child_process').exec;

/* Display Messages to Console */
console.log('Cleaning build folders');
removeDirectory(root + '/build');

console.log('Running TypeScript');
runTypeScript(stdout => {
  console.log('all done');
});

/* Run TypeScript */
function runTypeScript(cb) {
  // this is an actual command
  exec(
    'node ' + root + '/node_modules/typescript/bin/tsc',
    (err, stdout, stderr) => {
      if (err) throw stdout;
      cb(stdout);
    }
  );
}

/* Remove Directory Recursively */
function removeDirectory(path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);
    if (files.length === 0) {
      // Empty directory
      fs.rmdirSync(path);
    } else {
      // Directory has files
      files.map(item => path + '/' + item).forEach(item => {
        if (fs.lstatSync(item).isFile()) {
          // Just a file remove it
          fs.unlinkSync(item);
        } else {
          // Its a directory
          removeDirectory(item);
        }
      });
      removeDirectory(path); // Current path
    }
  }
}
