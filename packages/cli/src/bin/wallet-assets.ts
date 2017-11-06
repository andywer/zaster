import program = require('commander')
import { padEnd, sortBy } from 'lodash'
import { handleCLIError } from '../errors'
import { asset as formatAsset, grey } from '../formats'
import { initSDK } from '../sdk'

const pkg = require('../../package.json')

program
  .name('wallet')
  .usage('assets')
  .description('List supported assets (coins, tokens).')
  .version(pkg.version)
  .parse(process.argv)

printAvailableAssets()
  .catch(handleCLIError)

async function printAvailableAssets () {
  const sdk = await initSDK()

  const formatAliases = aliases => {
    if (aliases.length === 0) {
      return grey('No aliases')
    } else {
      const formattedAliases = sortBy(aliases).map(alias => formatAsset(alias)).join(', ')
      return `${grey('Aliases:')} ${formattedAliases}`
    }
  }

  console.log('Supported assets:')
  console.log('')

  for (const asset of sdk.assets) {
    console.log(`  ${formatAsset(padEnd(asset.id, 4))}\t${grey(asset.name)}`)
    console.log(`  ${formatAliases(asset.aliases)}`)
    console.log('')
  }
}
