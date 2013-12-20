var request = require('request');

var DumbNumb = function () {
    if(false === (this instanceof DumbNumb)) {
        return new DumbNumb();
    }
}

DumbNumb.prototype.post = function (number) {
    var body = {numbers:[]};
    body.numbers.push({"name":number});
    var requestOptions = {
            uri: 'http://localhost:1729/numbers',
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.api+json'
            },
            body: JSON.stringify(body)
    };
    this.processRequest(requestOptions);
}

DumbNumb.prototype.get = exports.get = function () {
    var requestOptions = {
            uri: 'http://localhost:1729/numbers',
            method: 'GET'
    };
    this.processRequest(requestOptions);
}

DumbNumb.prototype.processRequest = function (requestOptions) {
    request(requestOptions, function(error, response, body) {
        if (!error && (response.statusCode == 200 || response.statusCode == 201))  {
            var reply = JSON.parse(body);
            console.log(reply);
        }
    });
}

module.exports = DumbNumb;