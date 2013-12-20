#!/usr/bin/env node
var program = require('commander');
var DumbNumb = require('../lib/dumbnumb-lib');
var n = new DumbNumb();

exports.command = {
  description: 'Adds a number with it\'s description(s)'
};

if (require.main === module) {

    program
    .version('0.0.1')
    .option('-n, --number <number>', 'A number to be added.\t\t\t\t*Required*')
    .option('-d, --desc <description>', 'Description(s) for the number to be added.\t*Required*')
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

    n.post(program.number); 
}