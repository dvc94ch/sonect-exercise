const gulp = require('gulp');
const exec = require('child_process').exec;

const runCommand = (command) => {
  return (cb) => {
    exec(command, (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  };
};

gulp.task('start-db',
  runCommand('mongod --fork --dbpath data --logpath mongod.log'));

gulp.task('stop-db',
  runCommand('mongo admin --eval "db.shutdownServer();"'));
