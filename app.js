var stores = require('./stores.json'),
    devices = require('./devices.json'),
    request = require('request'),
    _ = require('lodash'),
    colors = require('colors');

var modelsRequired = ['MN4V2B/A', 'MN512B/A', 'MN4W2B/A'];
var minutes = 10, int = minutes * 60 * 1000;

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
                    }
                });
                if (stock === 0) {
                    console.log('None In Stock'.red);
                } else {
                    console.log('FOUND STOCK AVAILABLE, EXITING APPLICATION'.bold.green);
                    process.exit(0);
                }
            });
        }
    });

};

setInterval(doSearch, int);