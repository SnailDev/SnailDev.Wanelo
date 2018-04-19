const cookie = 'optimizelyEndUserId=oeu1523539652533r0.9974600978753565; optimizelySegments=%7B%22301470788%22%3A%22gc%22%2C%22301692335%22%3A%22false%22%2C%22301861036%22%3A%22referral%22%2C%226497761104%22%3A%22none%22%7D; optimizelyBuckets=%7B%7D; _ga=GA1.2.964669232.1523539653; first_time_visit=1523539653899; __stripe_mid=3e70f206-1fd4-4789-835f-4fa50ff2826b; got_phone=1; mp_d058a359ce518261ee388c48881a50fc_mixpanel=%7B%22distinct_id%22%3A%20%22162ba0a342a484-0bafb147e54b84-b34356b-ff000-162ba0a342b152%22%2C%22session%22%3A%20%22logged%20in%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwanelo.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22wanelo.com%22%2C%22created_at%22%3A%201511168696000%2C%22username%22%3A%20%22zhouqiquan%22%2C%22gender%22%3A%20%22female%22%2C%22age_range%22%3A%20null%2C%22user_state%22%3A%20%22active%22%2C%22email_confirmed%22%3A%20false%2C%22facebook_connected%22%3A%20false%2C%22twitter_connected%22%3A%20false%2C%22email_optin%22%3A%20true%2C%22timeline_optin%22%3A%20true%2C%22email_hard_bounced%22%3A%20false%2C%22mp_name_tag%22%3A%20%22zhouqiquan%22%7D; remember_user_token=BAhbCFsGaQRaJ08BSSIiJDJhJDEwJHM2L2QyWmpSQ2l6N1NwOEdldk0ucE8GOgZFVEkiFjE1MjQwNTcyNzQuMjU4NjY4BjsARg%3D%3D--0fa427d4a4e2af69a54d6f1d3bfe501017ca9b9f; initial_url=https%3A%2F%2Fwanelo.co%2Fp%2F68699042%2Fadidas-women-men-yeezy-550-boost-350-v2-fashion-girl-boy-trending-personality-leisure-sport-running-shoe-sneakers-black-khaki; csrf-token=YbJmGl%2BsQui5%2B9K%2FlOeNxCc8xPoByj%2BBvAmsiHc9XLk%3D; csrf-param=authenticity_token; _ssn=2cea59e2696a7ed8b4f3b016413eeeb1; session-page-view-count=1; _gid=GA1.2.1437550410.1524057278; initial_referrer=https%3A%2F%2Fwanelo.co%2Fp%2F68699042%2Fadidas-women-men-yeezy-550-boost-350-v2-fashion-girl-boy-trending-personality-leisure-sport-running-shoe-sneakers-black-khaki; initial_referrer_domain=wanelo.co; __stripe_sid=6598b15e-038a-4939-80b4-ced61e44ae57';
const useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36';

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

//var count = 1;
for (let index = 1; index < 8; index++) {
    getproduct('https://wanelo.co/p/', index, 1);
}

function getproduct(url, productid, count) {
    //console.log(url);
    var options = {
        url: url + productid,
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
            if (!productStr) {getproduct('https://wanelo.co/p/', productid + 8, count); return;}
            var product = JSON.parse(productStr);
            //console.log(product);

            var newproduct = {
                _id: product.product_id,
                category: product.category,
                title: product.name,
                //handle: product.name.split(" ").join("-").toLowerCase(),
                body: $('.description p').eq(1).html(),
                price: product.price,
                original_price: product.original_price,
                vendor: $('.products-show-poster-details a').text(),
                published: false,
                savecount: parseInt($('.products-show-controls-save-count-tag-right').text()),
                reviewcount: parseInt($('.review-info span').text().split(' ')[0].trim()),
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
                    //var options = null;
                    var optionValues = [];
                    if (data.variants.length > 0) {
                        //options = Object.keys(data.variants[0].attributes);
                        data.variants.forEach(element => {
                            optionValues.push(element.attributes);
                        });
                    }

                    //newproduct.options = options;
                    newproduct.optionValues = optionValues;

                    //console.log(newproduct);
                    fs.writeFile('./data/' + newproduct._id + '.json', JSON.stringify(newproduct), function (err) {
                        if (err) {
                            throw err;
                        }

                        console.log(productid + '===>Saved.');
                        count = 1;

                        getproduct('https://wanelo.co/p/', productid + 8, count);
                    });

                    // // Connect using MongoClient
                    // MongoClient.connect(mongourl, function (err, client) {
                    //     // Create a collection we want to drop later
                    //     const col = client.db(dbName).collection('products');

                    //     col.update({ '_id': newproduct._id }, newproduct, { upsert: true }, function (err, result) {
                    //         if (err) {
                    //             console.log(newproduct);
                    //             console.log(err);
                    //         }
                    //     });

                    //     client.close();
                    // });
                } else {
                    console.log(productid + "===>2" + error);

                    if (count < 99) {
                        getproduct('https://wanelo.co/p/', productid + 8, count);
                    }
                }
            });
        } else {
            if (!error) {
                console.log(productid + "===>1,code:" + response.statusCode);
                if (response.statusCode == 404) {
                    count++;
                }
            }
            else {
                console.log(productid + "===>1" + error);
            }

            if (count < 99) {
                getproduct('https://wanelo.co/p/', productid + 8, count);
            }
        }
    });
}