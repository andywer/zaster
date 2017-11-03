import program from 'commander'
import pkg from '../../package.json'

program
  .name('wallet show')
  .command('balance', 'Show an account or wallet balance.')
  .version(pkg.version)
  .parse(process.argv)
