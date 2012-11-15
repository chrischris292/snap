/*
 * GET home page.
 */

var fs = require("fs");

exports.index = function(req, res) {
    //res.render('index', { title: 'Express' });
    
    
//    res.send("index.html")
    var filename = './index.html';
    fs.readFile(filename, 'utf8', function(err, text) {
        res.send(text);
        if (err) {
            res.send(err);
        }
    });

};