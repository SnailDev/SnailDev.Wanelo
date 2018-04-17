const cookie = 'optimizelyEndUserId=oeu1523522394716r0.5659626599247558; optimizelySegments=%7B%22301470788%22%3A%22gc%22%2C%22301692335%22%3A%22false%22%2C%22301861036%22%3A%22direct%22%2C%226497761104%22%3A%22none%22%7D; optimizelyBuckets=%7B%7D; _ga=GA1.2.2107598485.1523522395; first_time_visit=1523522401052; __stripe_mid=26b84a97-4196-466c-a17e-4e2b5437d5cb; __ssid=ac0e714c-40ae-4330-baad-39c3635cbca1; _gid=GA1.2.115761676.1523842175; csrf-param=authenticity_token; remember_user_token=BAhbCFsGaQRaJ08BSSIiJDJhJDEwJHM2L2QyWmpSQ2l6N1NwOEdldk0ucE8GOgZFVEkiFzE1MjM5Mzc0ODMuMTkwODIxNgY7AEY%3D--13b74a4d87ebb396032c545daa9464b563442172; csrf-token=JUgpjF3T3kr6B1Zfp%2FAkT4AICzlsXohR4TNSEdgXyHk%3D; _ssn=d6226a346c3830684687784f0418febf; session-page-view-count=2; mp_d058a359ce518261ee388c48881a50fc_mixpanel=%7B%22distinct_id%22%3A%20%22162b902e26d323-06a427148da047-b34356b-1fa400-162b902e26e865%22%2C%22session%22%3A%20%22logged%20in%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%2C%22created_at%22%3A%201511168696000%2C%22username%22%3A%20%22zhouqiquan%22%2C%22gender%22%3A%20%22female%22%2C%22age_range%22%3A%20null%2C%22user_state%22%3A%20%22active%22%2C%22email_confirmed%22%3A%20false%2C%22facebook_connected%22%3A%20false%2C%22twitter_connected%22%3A%20false%2C%22email_optin%22%3A%20true%2C%22timeline_optin%22%3A%20true%2C%22email_hard_bounced%22%3A%20false%2C%22mp_name_tag%22%3A%20%22zhouqiquan%22%7D; _mkra_ctxt=92069a3cee973812f56ffac803e7bf0a--200; initial_referrer=https%3A%2F%2Fwanelo.co%2Fp%2F52571459%2Ffashion-unisex-sports-running-shoes-sneakers; initial_referrer_domain=wanelo.co; initial_url=https%3A%2F%2Fwanelo.co%2Fp%2F52571459%2Ffashion-unisex-sports-running-shoes-sneakers; optimizelyPendingLogEvents=%5B%5D';
const useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36';

var request = require('request');
var cheerio = require('cheerio');
// var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
// Connection url
const mongourl = 'mongodb://localhost:27017';
// Database Name
const dbName = 'Wanelo';

var options = {
    url: 'https://wanelo.co/search?query=1',
    headers: {
        'User-Agent': useragent,
        'Cookie': cookie,
    }
}
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        var totalpage = parseInt($('.page-links .wnl-page').eq($('.page-links .wnl-page').length - 1).text());
        //console.log(totalpage);

        for (i = 1; i < 21; i++) {
            getproductpage(options.url + '&page=' + i);
        }
    } else {
        console.log(error);
    }
});

function getproductpage(url) {
    //console.log(url);
    var options = {
        url: url,
        headers: {
            'User-Agent': useragent,
            'Cookie': cookie,
        }
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            $('.products-thumbnails .product-thumbnail').each(function (index, element) {
                // options.url = 'https://wanelo.co' + $(element).attr('href');
                getproduct('https://wanelo.co' + $(element).attr('href'))
            });
        } else {
            console.log("3" + error);
        }
    });
}

function getproduct(url) {
    //console.log(url);
    var options = {
        url: url,
        headers: {
            'User-Agent': useragent,
            'Cookie': cookie,
        }
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            var $ = cheerio.load(body);

            var productStr = $('meta[name="segment-event-attribution"]').attr('content');
            if (!productStr) return;
            var product = JSON.parse(productStr);
            //console.log(product);

            var newproduct = {
                _id: product.product_id,
                category: product.category,
                title: product.name,
                handle: product.name.split(" ").join("-").toLowerCase(),
                body: $('.description p').eq(1).html(),
                price: product.price,
                original_price: product.original_price,
                vendor: $('.products-show-poster-details a').text(),
                published: false,
                tags: $('.product-tags').text(),
                img: $('.products-show-image .product-image').attr('src'),
                thumbnails: []
            }
            $('.variant-thumbnails img').each(function (index, element) {
                newproduct.thumbnails.push($(element).attr('src'));
            });

            options.url = 'https://wanelo.co/p/' + newproduct._id + '/variants'; //https://wanelo.co/related-products/54677429
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //console.log(body);
                    var data = JSON.parse(body);
                    var options = null;
                    var optionValues = [];
                    if (data.variants.length > 0) {
                        options = Object.keys(data.variants[0].attributes);
                        data.variants.forEach(element => {
                            optionValues.push(element.attributes);
                        });
                    }

                    newproduct.options = options;
                    newproduct.optionValues = optionValues;

                    //console.log(newproduct);
                    // fs.writeFile('./data/' + newproduct.id + '.json', JSON.stringify(newproduct), function (err) {
                    //     if (err) {
                    //         throw err;
                    //     }

                    //     console.log('Saved.');
                    // });

                    // Connect using MongoClient
                    MongoClient.connect(mongourl, function (err, client) {
                        // Create a collection we want to drop later
                        const col = client.db(dbName).collection('products');

                        col.update({ '_id': newproduct._id }, newproduct, { upsert: true }, function (err, result) {
                            if (err) {
                                console.log(newproduct);
                                console.log(err);
                            }
                        });

                        client.close();
                    });
                } else {
                    console.log("2" + error);
                }
            });
        } else {
            console.log("1" + error);
        }
    });
}