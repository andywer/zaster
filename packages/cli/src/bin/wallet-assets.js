import chalk from 'chalk'
import program from 'commander'
import { loadOrCreateStore } from 'key-store'
import { padEnd, sortBy } from 'lodash'
import { loadSDK } from '@wallet/sdk'
import pkg from '../../package.json'
import { implementations, keyStorePath } from '../config'
import { handleCLIError } from '../errors'

program
  .name('wallet')
  .usage('assets')
  .description('List supported assets (coins, tokens).')
  .version(pkg.version)
  .parse(process.argv)

printAvailableAssets()
  .catch(handleCLIError)

async function printAvailableAssets () {
  const keyStore = await loadOrCreateStore(keyStorePath)
  const sdk = loadSDK(keyStore, implementations)

  const formatAliases = aliases => {
    if (aliases.length === 0) {
      return chalk.grey('No aliases')
    } else {
      const formattedAliases = sortBy(aliases).map(alias => chalk.blue(alias)).join(', ')
      return `${chalk.grey('Aliases:')} ${formattedAliases}`
    }
  }

  console.log('Supported assets:')
  console.log('')

  for (const asset of sdk.assets) {
    console.log(`  ${chalk.blue(padEnd(asset.id, 4))}\t${chalk.grey(asset.name)}`)
    console.log(`  ${formatAliases(asset.aliases)}`)
    console.log('')
  }
}
