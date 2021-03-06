/**
 * Created by g.kosharov on 28.8.2016
 */

// Since postinstall will also run when you run npm install
// locally we make sure it only runs in production
console.log("NODE_ENV = " + process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {

    // We just create a child process that will run
    // the production bundle command
    var child_process = require('child_process');
    child_process.exec("webpack -p --config webpack.prod.config.js", function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}