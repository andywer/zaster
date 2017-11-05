import program from 'commander'
import pkg from '../../package.json'
import { newInputError, handleCLIError } from '../errors'
import { initSDK } from '../sdk'

program
  .name('wallet')
  .usage('rm <walletId>')
  .description('Remove a wallet.')
  .version(pkg.version)
  .parse(process.argv)

removeWallet(program)
  .catch(handleCLIError)

async function removeWallet ({ args }) {
  const [ walletId ] = args
  const sdk = await initSDK()

  if (args.length !== 1) throw newInputError(`Expected one argument: The wallet ID. Got ${args.length}.`)

  const presentWalletIDs = sdk.wallets.getWalletIDs()
  if (!presentWalletIDs.includes(walletId)) throw newInputError(`Wallet '${walletId}' not found.`)

  await sdk.wallets.removeWallet(walletId)

  console.log(`Wallet removed: ${walletId}`)
}
