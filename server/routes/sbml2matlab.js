///*
// * GET sbml2matlab translation
// */
//var spawn = require('child_process').spawn,
//    //sbml2matlab = spawn('pwd', ['-lh', '/usr']);
//    sbml2matlab = spawn('pwd'),
//    translation = 'no translation available';
//exports.translate = function (req, res) {
//    sbml2matlab.stdout.on('data', function (data) {
//        translation = 'stdout: ' + data;
//    });
//    sbml2matlab.stderr.on('data', function (data) {
//        translation = 'stderr: ' + data;
//    });
//    sbml2matlab.on('exit', function (code) {
//        translation = 'child process exited with code ' + code;
//    });
//    res.send(translation);
//};
exports.translate = function (req, res) {
    var exec = require('child_process').exec,
        fs = require('fs'),
        child,
        querystring = require('querystring'),
        url = require('url'),
        sbml; // request processing
    var command = "cd server/sbml2matlab/install/ && ./sbml2matlab '" + req.body.sbml + "'";
    var options = {
        //cwd: 'server/sbml2matlab/install/',
        timeout: 10
    };
    console.log(command);
    child = exec(command, options, function (error, stdout, stderr) {
        //child = exec('pwd', function (error, stdout, stderr) {
        // res.send(stdout + stderr);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
};