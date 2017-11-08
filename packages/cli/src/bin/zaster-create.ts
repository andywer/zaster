import program = require('commander')
import { newInputError, handleCLIError } from '../errors'
import { initSDK } from '../sdk'
import { walletAdded } from '../texts'
import { readPassword } from '../tty'

const pkg = require('../../package.json')

program
  .name('zaster')
  .usage('create <walletId> --asset <asset> [--testnet]')
  .description('Create a new empty wallet from scratch.')
  .version(pkg.version)
  .option('--asset <asset>', 'The wallet\'s asset. One of `wallet assets`.')
  .option('--testnet', 'Set this flag to indicate that this is a testnet wallet.')
  .option('--no-password-repeat', 'Do not prompt for password twice.')
  .parse(process.argv)

createWallet(program)
  .catch(handleCLIError)

async function createWallet ({ args, ...options }) {
  const [ walletId ] = args
  const { asset: assetID, testnet = false } = options
  const sdk = await initSDK()

  if (args.length !== 1) throw newInputError(`Expected one argument: The wallet ID. Got ${args.length}.`)
  if (!assetID) throw newInputError(`No asset passed. Use --asset.`)
  if (!sdk.assets.find(availableAsset => availableAsset.id === assetID)) throw newInputError(`Unknown asset: ${assetID}`)

  const asset = sdk.getAsset(assetID)
  if (!asset) throw newInputError(`Unknown asset: ${assetID}`)

  const presentWalletIDs = sdk.wallets.getWalletIDs()
  if (presentWalletIDs.includes(walletId)) throw newInputError(`Wallet '${walletId}' exists already.`)

  // TODO: Let network implementation do a sanity check on the private key

  const password = await readPassword({ repeat: options.passwordRepeat })
  // TODO: Warn if password is insecure

  await sdk.wallets.createWallet(walletId, asset, password, { testnet })

  console.log('\n' + walletAdded(walletId, { testnet }))
}
