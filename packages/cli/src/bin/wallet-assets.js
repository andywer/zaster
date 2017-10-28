import chalk from 'chalk'
import program from 'commander'
import { loadOrCreateStore } from 'key-store'
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

  console.log('Supported assets:')

  for (const asset of sdk.assets) {
    console.log(`  ${chalk.blue(asset.id)} ${chalk.grey(asset.name)}`)
  }
}
