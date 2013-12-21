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
    .option('-n, --number [number]', 'A number to be listed with all its description(s).')
    .parse(process.argv);

    dumbnumb.get(program.number);
}