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

DumbNumb.prototype.get = exports.get = function (number) {
    var requestOptions = {
            uri: 'http://localhost:1729/numbers/' + (number || ''),
            method: 'GET'
    };
    this.processRequest(requestOptions);
}

DumbNumb.prototype.delete = exports.get = function (number) {
    var requestOptions = {
            uri: 'http://localhost:1729/numbers/' + number ,
            method: 'DELETE'
    };
    this.processRequest(requestOptions);
}

DumbNumb.prototype.processRequest = function (requestOptions) {
    var reply;
    request(requestOptions, function(error, response, body) {
        if (!error && (response.statusCode == 200 || response.statusCode == 201 )) {
            try {
                reply = JSON.parse(body);
            } catch (err) {
                reply = body;
            }
            console.log(reply);
        }
        if (!error && response.statusCode == 204){
            console.log('Removed.')
        }
    });
}

module.exports = DumbNumb;