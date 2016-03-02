/**
 * @file prompt
 * @author lanmingming
 * @date 2016-3-2
 */
var chalk = require('chalk');
var readline = require('readline');


/**
 * prompt
 * @param {object} option {tip: ***, handler: [function]}
 */
function prompt (option) {

	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.question(option.tip, function (answers) {
		answers = answers.toLowerCase();
		if (answers === 'y' || answers === 'yes') {
			accept(option.handler);
		}
		else if (answers === 'n' || answers === 'no') {
			reject();
		}
		else {
			console.log(chalk.red('error input...'));
		}
		rl.close();
	})
}

var accept = function (handler) {
	if (!handler) {
		return this;
	}
	return handler.apply(this, arguments);
};

var reject = function () {
	console.log('reject')
	return this;
};

module.exports = prompt;