import program from 'commander'
import input from 'input'
import pkg from '../../package.json'
import { newInputError, handleCLIError } from '../errors'
import { initSDK } from '../sdk'

program
  .name('wallet')
  .usage('add <walletId> --asset <asset> --private-key <key> [--testnet]')
  .description('Add a wallet by private key.')
  .version(pkg.version)
  .option('--asset <asset>', 'The wallet\'s asset. One of `wallet assets`.')
  .option('--private-key <key>', 'The private key.')
  .option('--testnet', 'Set this flag to indicate that this is a testnet wallet.')
  .option('--no-password-repeat', 'Do not prompt for password twice.')
  .parse(process.argv)

addWallet(program)
  .catch(handleCLIError)

async function addWallet ({ args, ...options }) {
  const [ walletId ] = args
  const { asset: assetID, privateKey, testnet = false } = options
  const sdk = await initSDK()

  if (args.length !== 1) throw newInputError(`Expected one argument: The wallet ID. Got ${args.length}.`)
  if (!assetID) throw newInputError(`No asset passed. Use --asset.`)
  if (!sdk.assets.find(availableAsset => availableAsset.id === assetID)) throw newInputError(`Unknown asset: ${assetID}`)
  if (!privateKey) throw newInputError(`No private key passed. Use --private-key.`)

  const asset = sdk.getAsset(assetID)
  const presentWalletIDs = sdk.wallets.getWalletIDs()
  if (presentWalletIDs.includes(walletId)) throw newInputError(`Wallet '${walletId}' exists already.`)

  // TODO: Let network implementation do a sanity check on the private key

  const password = await readPassword({ repeat: options.passwordRepeat })
  // TODO: Warn if password is insecure

  await sdk.wallets.addWallet(walletId, asset, privateKey, password, { testnet })

  if (testnet) {
    console.log(`Wallet added: ${walletId}`)
  } else {
    console.log(`Testnet wallet added: ${walletId}`)
  }
}

async function readPassword ({ repeat = true }) {
  const password = await input.password(`Password: `)

  if (repeat) {
    const repeatedPassword = await input.password(`Repeat password: `)
    if (repeatedPassword !== password) throw newInputError(`Passwords do not match.`)
  }

  return password
}
