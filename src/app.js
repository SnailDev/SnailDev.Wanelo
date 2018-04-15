var request = require('request');
var cheerio = require('cheerio');

var options = {
    url: 'https://wanelo.co/p/68699042/adidas-women-men-yeezy-550-boost-350-v2-fashion-girl-boy-trending-personality-leisure-sport-running-shoe-sneakers-black-khaki',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
        'Cookie': 'optimizelyEndUserId=oeu1523539652533r0.9974600978753565; optimizelySegments=%7B%22301470788%22%3A%22gc%22%2C%22301692335%22%3A%22false%22%2C%22301861036%22%3A%22referral%22%2C%226497761104%22%3A%22none%22%7D; optimizelyBuckets=%7B%7D; _ga=GA1.2.964669232.1523539653; first_time_visit=1523539653899; __stripe_mid=3e70f206-1fd4-4789-835f-4fa50ff2826b; csrf-param=authenticity_token; got_phone=1; _gid=GA1.2.1882393481.1523782827; initial_referrer=https%3A%2F%2Fwanelo.co%2Fp%2F68699042%2Fadidas-women-men-yeezy-550-boost-350-v2-fashion-girl-boy-trending-personality-leisure-sport-running-shoe-sneakers-black-khaki; initial_referrer_domain=wanelo.co; initial_url=https%3A%2F%2Fwanelo.co%2Fusers%2Fme%3Frequesting_controller%3Dproducts%26requesting_action%3Dshow%26params%255Bproduct_id%255D%3D68699042%26exclude_params%255B%255D%3Dcollections; __stripe_sid=fd545dae-f61c-40df-9331-57c0afafccb3; remember_user_token=BAhbCFsGaQRaJ08BSSIiJDJhJDEwJHM2L2QyWmpSQ2l6N1NwOEdldk0ucE8GOgZFVEkiFzE1MjM3OTI1MTQuODU0MzcwOAY7AEY%3D--5028b7b16f35b62ff24b98e0f81665ca5e13ac3e; csrf-token=EEpnhNjW%2FbzImWhuCKgiP0hHYI3tSMaknbzN2du%2FhFQ%3D; _ssn=e3aee4c31f5d5527f0c6a06c41630165; session-page-view-count=8; _gat=1; mp_d058a359ce518261ee388c48881a50fc_mixpanel=%7B%22distinct_id%22%3A%20%22162ba0a342a484-0bafb147e54b84-b34356b-ff000-162ba0a342b152%22%2C%22session%22%3A%20%22logged%20in%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwanelo.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22wanelo.com%22%2C%22created_at%22%3A%201511168696000%2C%22username%22%3A%20%22zhouqiquan%22%2C%22gender%22%3A%20%22female%22%2C%22age_range%22%3A%20null%2C%22user_state%22%3A%20%22active%22%2C%22email_confirmed%22%3A%20false%2C%22facebook_connected%22%3A%20false%2C%22twitter_connected%22%3A%20false%2C%22email_optin%22%3A%20true%2C%22timeline_optin%22%3A%20true%2C%22email_hard_bounced%22%3A%20false%2C%22mp_name_tag%22%3A%20%22zhouqiquan%22%7D',
    }
}

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
        var $ = cheerio.load(body);

        var handle = $('.products-show-title-inner-container h1 span').text().trim();
        var title = $('.products-show-title-inner-container h1 span').text().trim();
        var body = $('.description p').eq(1).html();
        var vendor = $('.products-show-poster-details a').text();

        console.log('Handle:' + handle + " title:" + title + " body:" + body + " vendor:" + vendor);
    } else {
        console.log(error);
    }
});