import program from 'commander'
import pkg from '../../package.json'
import { newInputError, handleCLIError } from '../errors'
import { balance as formatBalance, grey } from '../formats'
import { initSDK } from '../sdk'

program
  .name('wallet show')
  .usage('balance <walletId> | <asset>:<address> [--testnet]')
  .description('Show the balance of a wallet or address.')
  .option('--raw', 'Output raw balance, without surrounding text.')
  .option('--testnet', 'Indicates that the given address is a testnet address.')
  .version(pkg.version)
  .parse(process.argv)

showBalance(program)
  .catch(handleCLIError)

async function showBalance ({ args, raw = false, testnet = false }) {
  if (args.length !== 1) throw newInputError(`Expected exactly one argument: A wallet ID or <asset>:<address>`)

  const sdk = await initSDK()
  const [ arg ] = args

  if (arg.indexOf(':') > -1) {
    const [ assetID, address ] = arg.split(':')
    const asset = sdk.getAsset(assetID)
    const balance = await sdk.ledger.getAddressBalance(asset, address, { testnet })

    if (raw) {
      console.log(balance.toString())
    } else {
      console.log(grey(`Balance of ${address}:`))
      console.log(`  ${formatBalance(balance, assetID)}`)
    }
  } else {
    const walletID = arg
    const walletIDs = sdk.wallets.getWalletIDs()

    if (!walletIDs.includes(walletID)) throw newInputError(`Wallet not found: ${walletID}`)

    const wallet = await sdk.wallets.getWallet(walletID)
    const balance = await sdk.ledger.getWalletBalance(walletID)

    if (raw) {
      console.log(balance.toString())
    } else {
      console.log(grey(`Balance of ${walletID}:`))
      console.log(`  ${formatBalance(balance, wallet.asset.id)}`)
    }
  }
}
