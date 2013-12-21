var request = require('request');
var Table = require('cli-table');
var table = new Table();
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

DumbNumb.prototype.get = exports.get = function (options) {

    var self = this;

    // Prepare request
    var requestOptions = {
            uri: baseURL + '/numbers/' + (options.number || ''),
            method: 'GET'
    };

    // Call API.
    this.processRequest(requestOptions, function (error, response, body) {
        if (!error && (response.statusCode == 200 || response.statusCode == 201 )) {
            try {
                reply = JSON.parse(body);

                if (options.isTable) {
                    self.displayNumbers(reply);
                }
                else {
                    console.log(reply);
                }
            } catch (err) {
                reply = body;
                throw new Error(err);
            }
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

DumbNumb.prototype.displayNumbers = function (numberJSON) {

    var table = new Table({
        head: ['Id', 'Name', 'Description'],
        colWidths: [19, 15, 100]
    });

    numberJSON.numbers.map( function(n) {
        var aNumber = [];
        aNumber.push(n.id);
        aNumber.push(n.name);
        var descriptions = '';
        if (n.links && n.links.descriptions) {
            n.links.descriptions.map( function(d) {
                //TODO - Bring the actual description.
                descriptions += d;
                descriptions += "\n";
            });
        }
        aNumber.push(descriptions ? descriptions : '~ No Description ~');
        table.push(aNumber);
    });

    console.log(table.toString());
}

module.exports = DumbNumb;