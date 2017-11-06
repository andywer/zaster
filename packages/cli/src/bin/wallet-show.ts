import program = require('commander')

const pkg = require('../../package.json')

program
  .name('wallet show')
  .command('balance', 'Show an account or wallet balance.')
  .version(pkg.version)
  .parse(process.argv)
