import chalk from 'chalk'
import program from 'commander'
import pkg from '../../package.json'

program
  .name('wallet')
  .usage('assets')
  .description('List supported assets (coins, tokens).')
  .version(pkg.version)
  .parse(process.argv)

printAvailableAssets()

function printAvailableAssets () {
  const assets = []

  console.log('Supported assets:')

  for (const asset of assets) {
    console.log(`  - ${chalk.blue(asset.id)} ${chalk.grey(asset.name)}`)
  }
}
