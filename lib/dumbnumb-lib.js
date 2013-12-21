var request = require('request');
var config = require('rc')('dumbnumb', {
  //defaults configuration goes here.
  host:'localhost',
  port: 1729,
});

var baseURL = 'http://' + config.host + ':' + config.port ;

var DumbNumb = function () {
    if(false === (this instanceof DumbNumb)) {
        return new DumbNumb();
    }
}

DumbNumb.prototype.post = function (number) {

    // Prepare request
    var body = {numbers:[]};
    body.numbers.push({"name":number});
    var requestOptions = {
            uri: baseURL + '/numbers',
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.api+json'
            },
            body: JSON.stringify(body)
    };

    // Call API.
    this.processRequest(requestOptions, function (error, response, body) {
        if (!error && (response.statusCode == 200 || response.statusCode == 201 )) {
            try {
                reply = JSON.parse(body);
            } catch (err) {
                reply = body;
            }
            console.log(reply);
        }
    });
}

DumbNumb.prototype.get = exports.get = function (number) {

    // Prepare request
    var requestOptions = {
            uri: baseURL + '/numbers/' + (number || ''),
            method: 'GET'
    };

    // Call API.
    this.processRequest(requestOptions, function (error, response, body) {
        if (!error && (response.statusCode == 200 || response.statusCode == 201 )) {
            try {
                reply = JSON.parse(body);
            } catch (err) {
                reply = body;
            }
            console.log(reply);
        }
    });
}

DumbNumb.prototype.delete = exports.delete = function (number) {

    // Prepare request
    var requestOptions = {
            uri: baseURL + '/numbers/' + number ,
            method: 'DELETE'
    };

    // Call API.
    this.processRequest(requestOptions, function (error, response, body) {
        if (!error && response.statusCode == 204){
            console.log('Removed.')
        }
    });
}

DumbNumb.prototype.processRequest = function (requestOptions, callback) {
    var reply;
    request(requestOptions, function(error, response, body) {
        callback(error, response, body);
    });
}

module.exports = DumbNumb;