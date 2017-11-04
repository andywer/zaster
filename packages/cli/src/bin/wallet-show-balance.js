import program from 'commander'
import pkg from '../../package.json'
import { newInputError, handleCLIError } from '../errors'
import { initSDK } from '../sdk'

program
  .name('wallet show')
  .usage('balance <walletId> | <asset>:<address> [--testnet]')
  .description('Show the balance of a wallet or address.')
  .option('--testnet', 'Indicates that the given address is a testnet address.')
  .version(pkg.version)
  .parse(process.argv)

showBalance(program)
  .catch(handleCLIError)

async function showBalance ({ args, testnet = false }) {
  if (args.length !== 1) throw newInputError(`Expected exactly one argument: A wallet ID or <asset>:<address>`)

  const sdk = await initSDK()
  const [ arg ] = args

  if (arg.indexOf(':') > -1) {
    const [ assetID, address ] = arg.split(':')
    const asset = sdk.getAsset(assetID)
    const balance = await sdk.ledger.getAddressBalance(asset, address, { testnet })
    console.log(balance.toString())
  } else {
    // TODO
    /* Not functional yet:
    const walletID = arg
    const walletIDs = sdk.getWalletIDs()

    if (!walletIDs.includes(walletID)) throw newInputError(`Wallet not found: ${walletID}`)

    const balance = await sdk.getWalletBalance(walletID)
    console.log(balance.toString())
    */
  }
}
