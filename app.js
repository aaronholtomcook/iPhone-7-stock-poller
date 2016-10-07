var stores = require('./stores.json'),
devices = require('./devices.json'),
request = require('request'),
beep = require('beepbeep'),
_ = require('lodash'),
spawn = require('child_process').spawn,
colors = require('colors');

var modelsRequired = ['MN4V2B/A', 'MN512B/A'];
var minutes = 0.5, int = minutes * 60 * 1000;

var textSent = 0;

var doSearch = function() {
	request('https://reserve.cdn-apple.com/GB/en_GB/reserve/iPhone/availability.json', function(error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			console.log('\n\n\n\n');
			console.log('Running iPhone 7 Stock Check'.bold.yellow);
			console.log('Apple Stock Last Updated @ '.white + colors.white(new Date(body.updated)));
			_.forEach(modelsRequired, function(model) {
				var stock = 0;
				console.log('\n\n');
				console.log(devices[model].type + ' ' + devices[model].colour + ' ' + devices[model].size);
				_.forEach(body, function(value, key) {
					if (value[model] === 'NONE') {
                        //  console.log(stores[key] + ': None in stock');
                    } else if (value[model] !== undefined) {
                    	stock++;
                    	console.log('\n' + stores[key] + ': IN STOCK'.bold.green);
                    	if (key === 'R341' || key === 'R423') {
                    		beep(3, 50);
                    		if (textSent <= 5) {
                    			request('http://api.sendmode.com/httppost.aspx?Type=sendparam&username=usr&password=pw&numto=num&senderid=ISTKCHK&data1=' + devices[model].type + ' ' + devices[model].colour + ' ' + devices[model].size + ' IN STOCK @ ' + stores[key], function(err,res,body) {

                    			});
                    			textSent++;
                    		}
                    		spawn('open', ['http://www.apple.com/uk/shop/iphone/iphone-upgrade-program']);

                    	}

                    }
                });
				if (stock === 0) {
					console.log('None In Stock'.red);
				} else {
					beep();

					console.log('FOUND STOCK AVAILABLE'.bold.green);
				}
			});
		}
	});

};

setInterval(doSearch, int);
doSearch();