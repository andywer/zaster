import program from 'commander'
import { padEnd } from 'lodash'
import pkg from '../../package.json'
import { handleCLIError } from '../errors'
import { grey } from '../formats'
import { initSDK } from '../sdk'

program
  .name('wallet')
  .usage('ls')
  .description('List wallets.')
  .version(pkg.version)
  .parse(process.argv)

printWallets()
  .catch(handleCLIError)

async function printWallets () {
  const sdk = await initSDK()
  const walletIDs = sdk.wallets.getWalletIDs()

  if (walletIDs.length === 0) {
    console.log('(No wallets)')
  } else {
    for (const walletID of walletIDs) {
      const wallet = await sdk.wallets.getWallet(walletID)
      const metadata = await getWalletMetadata(wallet)
      const formattedWalletID = padEnd(walletID, 16)
      const formattedMetadata = grey(formatMetadata(metadata))
      console.log(`  ${formattedWalletID}\t${formattedMetadata}`)
    }
  }
}

async function getWalletMetadata (wallet) {
  const walletOptions = await wallet.getOptions()
  return {
    asset: wallet.asset.id,
    testnet: walletOptions.testnet || false
  }
}

function formatMetadata ({ asset, testnet }) {
  const metaPropStrings = [
    `Asset: ${asset}`,
    testnet ? 'Testnet' : ''
  ]
  const combinedString = metaPropStrings.filter(string => Boolean(string)).join(', ')
  return `[ ${combinedString} ]`
}
