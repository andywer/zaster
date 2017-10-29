import chalk from 'chalk'
import program from 'commander'
import { loadOrCreateStore } from 'key-store'
import { padEnd } from 'lodash'
import pkg from '../../package.json'
import { keyStorePath } from '../config'
import { handleCLIError } from '../errors'

program
  .name('wallet')
  .usage('ls')
  .description('List wallets.')
  .version(pkg.version)
  .parse(process.argv)

printWallets()
  .catch(handleCLIError)

async function printWallets () {
  const store = await loadOrCreateStore(keyStorePath)
  const walletIDs = store.getWalletIDs()

  if (walletIDs.length === 0) {
    console.log('(No wallets)')
  } else {
    for (const walletID of walletIDs) {
      const metadata = await store.readWalletPublicData(walletID)
      const formattedWalletID = padEnd(walletID, 16)
      const formattedMetadata = chalk.grey(formatMetadata(metadata))
      console.log(`  ${formattedWalletID}\t${formattedMetadata}`)
    }
  }
}

function formatMetadata (metadata) {
  const metaPropStrings = [
    `Asset: ${metadata.asset}`,
    metadata.testnet ? 'Testnet' : ''
  ]
  const combinedString = metaPropStrings.filter(string => Boolean(string)).join(', ')
  return `[ ${combinedString} ]`
}
