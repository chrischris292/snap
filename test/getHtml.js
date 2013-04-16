var page = require('webpage').create();
var fs = require('fs');
page.open('http://localhost:3000', function (status) {
	if (status !== 'success') {
		console.log('Unable to access network');
	} else {
		var p = page.content;
		f = fs.open('page.html', "w");
		f.write(p);
		f.close();
	}
	phantom.exit();
});
