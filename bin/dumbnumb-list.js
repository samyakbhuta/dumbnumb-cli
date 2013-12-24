#!/usr/bin/env node
var program = require('commander');
var DumbNumb = require('../lib/dumbnumb-lib');
var dumbnumb = new DumbNumb();

exports.command = {
  description: 'Adds a number with it\'s description(s)'
};

if (require.main === module) {

    program
    .version('0.0.1')
    .option('-i, --id [number_id]', 'An id of a number to be listed with all its description(s).')
    .option('-h, --host [serverhost]', 'Host server. Defaults to local.')
    .option('-p, --port [serverport]', 'Port host server is listening to. Defaults to 1729.')
    .option('-t, --table', 'If you want to display the numbers list as a pretty table.')
    .parse(process.argv);

    var options = {id:program.id,isTable:program.table};
    dumbnumb.getNumber(options, function (error, response, body) {
	  // Display both error and body.
	  if (!error && (response.statusCode == 200 || response.statusCode == 201 )) {
	    if (options.isTable) {
	        // Display as pretty table.
	        dumbnumb.displayNumbers(body);
	    } else {
	        // Just display as JSON.
	        console.log(body);
	    }
	  } else {
		if (!error) {
			// TODO : Display meaninful message and not just status code.
			console.log('Could not list. HTTP Response Code : ' + response.statusCode );
		} else {
		    // TODO : Display meaninful message instead of error dump.
		    console.log(error);
		}
	  }
    });
}