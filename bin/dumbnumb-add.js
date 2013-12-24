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
    .option('-n, --number <number>', 'A number to be added.\t\t\t\t*Required*')
    .option('-d, --desc <description>', 'Description(s) for the number to be added.\t*Required*')
    .option('-h, --host [serverhost]', 'Host server. Defaults to local.')
    .option('-p, --port [serverport]', 'Port host server is listening to. Defaults to 1729.')
    .option('-t, --table', 'If you want to display the numbers list as a pretty table.')
    .parse(process.argv);

    if (!program.number) {
        console.log('');
        console.log('  Oops ! Number is required.');
    	program.help(); // will exit as well.
    }

    if (!program.desc) {
        console.log('');
        console.log('  Oops ! Description is required.');
    	program.help(); // will exit as well.
    }


    var options = { 'number':program.number,
                    'description':program.desc,
                    'isTable':program.table };

    dumbnumb.postNumber(options, function (error, response, body) {
      // Display both error and body.
      if (!error && (response.statusCode == 200 || response.statusCode == 201 ) ) {
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
            console.log('Could not add. HTTP Response Code : ' + response.statusCode );
        } else {
            // TODO : Display meaninful message instead of error dump.
            console.log(error);
        }
      }
    });
}