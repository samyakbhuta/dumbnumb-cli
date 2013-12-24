#!/usr/bin/env node
var program = require('commander');
var DumbNumb = require('../lib/dumbnumb-lib');
var dumbnumb = new DumbNumb();

exports.command = {
  description: 'Removes a number with all description(s)'
};

if (require.main === module) {

    program
    .version('0.0.1')
    .option('-i, --id <number_id>', 'An id of a number to be deleted with all its description(s).')
    .option('-h, --host [serverhost]', 'Host server. Defaults to local.')
    .option('-p, --port [serverport]', 'Port host server is listening to. Defaults to 1729.')
    .parse(process.argv);

    if (!program.id) {
        console.log('');
        console.log('  Oops ! Number id is required.');
    	program.help(); // will exit as well.
    }

    var options = {id:program.id};
    dumbnumb.deleteNumber(options, function (error, response, body) {
        if (!error && response.statusCode == 204){
            console.log('Removed !');
        } else {
            if (!error) {
                // TODO : Display meaninful message and not just status code.
                console.log('Could not remove. HTTP Response Code : ' + response.statusCode );
            } else {
                // TODO : Display meaninful message instead of error dump.
                console.log(error);
            }
        }
    });
}