// http://tvp.daxiangdaili.com/ip/?tid=558591156749568&num=1&operator=3&delay=1&filter=on

const useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36';
var fs = require('fs');

var request = require('request');
var url = 'http://tvp.daxiangdaili.com/ip/?tid=';
//var url = 'http://qsrdk.daili666api.com/ip/?tid=';
//var url = 'http://daxiangdaili.com/pick/';

for (var i = 400000000000000; i > 399999999990000; i--) {
    getip(i);
}

function getip(tid) {
    var options = {
        url: url ,//+ tid + '&num=1&operator=3&delay=1&filter=on',

        method: "POST",
        form: { tid: tid, num: 1, operator: 3, delay: 1, filter: 'on' },

        headers: {
            'User-Agent': useragent,
        }
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body.indexOf('ERROR') == -1) {
                fs.writeFile('./data1/' + tid + '.json', body, function (err) {
                    if (err) {
                        throw err;
                    }

                    console.log(tid + '===>Saved.');

                });
            }
        }
        else {
            if (!error)
            console.log(tid + response.statusCode);
            console.log(error);
        
        }
        getip(tid - 10000);
    });
}


