import input from 'input'
import program = require('commander')
import dedent = require('dedent')
import { newInputError, handleCLIError } from '../errors'
import { green, grey } from '../formats'
import { initSDK } from '../sdk'

const pkg = require('../../package.json')

program
  .name('zaster')
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
  if (!asset) throw newInputError(`Unknown asset: ${assetID}`)

  const presentWalletIDs = sdk.wallets.getWalletIDs()
  if (presentWalletIDs.includes(walletId)) throw newInputError(`Wallet '${walletId}' exists already.`)

  // TODO: Let network implementation do a sanity check on the private key

  const password = await readPassword({ repeat: options.passwordRepeat })
  // TODO: Warn if password is insecure

  await sdk.wallets.addWallet(walletId, asset, privateKey, password, { testnet })

  console.log('')
  console.log(dedent`
    ${green(`${testnet ? 'Testnet wallet' : 'Wallet'} added: ${walletId}`)}
  `.trim())
  console.log('')

  console.log(grey(dedent`
    Security note:

    The private key has been saved to your local filesystem using a military-grade
    encryption. If you loose your password you will not be able to recover the key!

    Please make sure to store a backup of your private key in a safe place.
  `.trim()))
}

async function readPassword ({ repeat = true }) {
  const password = await input.password(`Password: `)

  if (repeat) {
    const repeatedPassword = await input.password(`Repeat password: `)
    if (repeatedPassword !== password) throw newInputError(`Passwords do not match.`)
  }

  return password
}
