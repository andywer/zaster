import chalk from 'chalk'
import program from 'commander'
import { loadOrCreateStore } from '@wallet/key-store'
import pkg from '../../package.json'
import { keyStorePath } from '../config'

program
  .name('wallet')
  .usage('ls')
  .description('List wallets.')
  .version(pkg.version)
  .parse(process.argv)

printWallets()
  .catch(error => {
    console.error(error.stack)
    process.exit(1)
  })

async function printWallets () {
  const store = await loadOrCreateStore(keyStorePath)
  const walletIDs = store.getWalletIDs()

  if (walletIDs.length === 0) {
    console.log('(No wallets)')
  } else {
    for (const walletID of walletIDs) {
      console.log(`  ${walletID}`)
    }
  }
}
