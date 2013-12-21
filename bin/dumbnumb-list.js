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
    .option('-h, --host [serverhost]', 'Host server. Defaults to local.')
    .option('-p, --port [serverport]', 'Port host server is listening to. Defaults to 1729.')
    .option('-t, --table', 'If you want to display the numbers list as a pretty a table.')
    .parse(process.argv);

    dumbnumb.getNumber({number:program.number,isTable:program.table});
}