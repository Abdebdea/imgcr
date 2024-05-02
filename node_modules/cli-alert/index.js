/*
 * CLI Alerts
 *
 * Cross platform CLI Alerts with colors
 * Work on macOS, Linux, and Windows.
 * Alerts: 'success', 'info', 'warning', 'error'
 *
 * @author Tauqueer <https://twitter.com/tkoriginale>
 */

const chalk = require('chalk')
const { success, error, warning, info } = require('log-symbols')

const { green, red, blue } = chalk

const orange = chalk.keyword('orange')

module.exports = options => {
	const defaultOptions = {
		type: 'error',
		msg: 'You forgot to define all options',
		name: ''
	}
	const opts = { ...defaultOptions, ...options }

	const { type, msg, name } = opts

	const printName = name ? name.toUpperCase() : type.toUpperCase()

	if (type === 'success') {
		console.log(`\n${success} ${green.inverse(` ${printName} `)} ${green(msg)}\n`)
	}

	if (type === 'error') {
		console.log(`\n${error} ${red.inverse(` ${printName} `)} ${red(msg)}\n`)
	}

	if (type === 'info') {
		console.log(`\n${info} ${blue.inverse(` ${printName} `)} ${blue(msg)}\n`)
	}

	if (type === 'warning') {
		console.log(`\n${warning} ${orange.inverse(` ${printName} `)} ${orange(msg)}\n`)
	}
}
