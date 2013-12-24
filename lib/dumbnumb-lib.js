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


// 'processRequest' is only function that is dependent of 'request' module.
// An implementor need to only change this function in order to replace the
// dependency from 'request' module to something else.

DumbNumb.prototype.processRequest = function (requestOptions, callback) {

    // Setting generic options for JSON-API/Fortune.js request

    // Settng generic headers
    requestOptions.headers = requestOptions.headers ? requestOptions.headers : {} ;

    // TODO : No need to send during GET ? Should study it.
    if (requestOptions.method == 'POST' || requestOptions.method == 'PUT') {
      requestOptions.headers['Content-Type'] = 'application/vnd.api+json';
    }

    // Setting json to true.
    requestOptions.json = true;

    // Send the request to the server
    request(requestOptions, function(error, response, body) {
        // Handle the request
        if (!error && (response.statusCode == 200 || response.statusCode == 201 )) {
          callback(null, response, body);
        } else {
          // TODO : Should we still pass response and body ? or we should pass null ?
          callback(error, response, body);
        }
    });
}

DumbNumb.prototype.postNumber = function (options, callback) {

    // Prepare request body
    var body = {numbers:[]};
    body.numbers.push({'name':options.number});

    // Prepare request options
    var requestOptions = {
            uri: baseURL + '/numbers',
            method: 'POST',
            body: JSON.stringify(body)
    };

    // Fire request
    this.processRequest(requestOptions, callback);
}

DumbNumb.prototype.getNumber = function (options, callback) {

    // Prepare request options
    var requestOptions = {
            uri: baseURL + '/numbers/' + (options.number || ''),
            method: 'GET'
    };

    // Fire request
    this.processRequest(requestOptions, callback);
}

DumbNumb.prototype.putNumber = function (options, callback) {

    // Make sure you have a number that you want to update
    if (!options.number){
        throw new Error('Number not available');
    }

    // Prepare request body
    var body = {numbers:[]};
    body.numbers.push(options.updatedNumberObject);

    // Prepare request options
    var requestOptions = {
            uri: baseURL + '/numbers/' + options.number,
            method: 'PUT',
            body: JSON.stringify(body)
    };

    // Fire request
    this.processRequest(requestOptions, callback);
}

DumbNumb.prototype.deleteNumber = function (options, callback) {

    // Prepare request options
    var requestOptions = {
            uri: baseURL + '/numbers/' + options.number ,
            method: 'DELETE'
    };

    // Fire request
    this.processRequest(requestOptions, callback);
}


DumbNumb.prototype.displayNumbers = function (numberJSON) {

    var table = new Table({
        head: ['Id', 'Name', 'Description'],
        colWidths: [19, 15, 100]
    });

    if (numberJSON.numbers && numberJSON.numbers.length > 0) {
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
    }
    console.log(table.toString());
}

DumbNumb.prototype.postDescription = function (options, callback) {

    // Prepare request body
    var body = {descriptions:[]};
    body.descriptions.push({"body":options.description});

    // Prepare request options
    var requestOptions = {
            uri: baseURL + '/descriptions',
            method: 'POST',
            body: JSON.stringify(body)
    };

    // Fire request
    this.processRequest(requestOptions, callback);
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