import chalk from 'chalk'
import program from 'commander'
import { loadOrCreateStore } from 'key-store'
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
      const margin = Math.max(16 - walletID.length, 0)
      const metadata = await store.readWalletPublicData(walletID)
      console.log(`  ${walletID}${' '.repeat(margin)}\t${chalk.grey(formatMetadata(metadata))}`)
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
