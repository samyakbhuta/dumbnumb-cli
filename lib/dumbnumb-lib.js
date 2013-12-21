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

DumbNumb.prototype.postNumber = function (options) {

    var self = this;

    // Prepare request
    var body = {numbers:[]};
    body.numbers.push({"name":options.number});
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
            self.postDescription(options);
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

DumbNumb.prototype.getNumber = exports.get = function (options) {

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

DumbNumb.prototype.putNumber = function (options) {

    if (!options.number){
        throw new Error('Number not available');
    }
    var self = this;

    // Prepare request
    var body = {numbers:[]};
    body.numbers.push(options.updatedNumberObject);
    var requestOptions = {
            uri: baseURL + '/numbers/' + options.number,
            method: 'PUT',
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

DumbNumb.prototype.deleteNumber = exports.delete = function (number) {

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

DumbNumb.prototype.postDescription = function (options) {

    var self = this;

    // Prepare request
    var body = {descriptions:[]};
    body.descriptions.push({"body":options.description});
    var requestOptions = {
            uri: baseURL + '/descriptions',
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

                if (options.isTable) {
                    self.displayDescriptions(reply);
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

DumbNumb.prototype.displayDescriptions = function (descriptionJSON) {

    var table = new Table({
        head: ['Id', 'Description', 'Name'],
        colWidths: [19, 100, 15]
    });

    descriptionJSON.descriptions.map( function(d) {
        var aDescription = [];
        aDescription.push(d.id);
        aDescription.push(d.body);
        aDescription.push(d.links && d.links.number ? d.links.number : '~ No Number ~');
        table.push(aDescription);
    });

    console.log(table.toString());
}
module.exports = DumbNumb;