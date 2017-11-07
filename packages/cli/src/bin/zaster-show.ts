import program = require('commander')

const pkg = require('../../package.json')

program
  .name('zaster show')
  .command('balance', 'Show an account or wallet balance.')
  .version(pkg.version)
  .parse(process.argv)
