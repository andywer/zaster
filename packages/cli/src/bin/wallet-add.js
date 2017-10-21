import program from 'commander'
import prompt from 'prompt-promise'
import { loadOrCreateStore } from '@wallet/key-store'
import pkg from '../../package.json'
import { keyStorePath } from '../config'
import { init as initImplementations } from '../implementations'
import { newInputError, handleCLIError } from '../errors'

program
  .name('wallet')
  .usage('add <walletId> --asset <asset> --private-key <key> [--testnet]')
  .description('Add a wallet by private key.')
  .version(pkg.version)
  .option('--asset <asset>', 'The wallet\'s asset. One of `wallet assets`.')
  .option('--private-key <key>', 'The private key.')
  .option('--testnet', 'Set this flag to indicate that this is a testnet wallet.')
  .parse(process.argv)

addWallet(program)
  .catch(handleCLIError)

async function addWallet ({ args, ...options }) {
  const [ walletId ] = args
  const { asset, privateKey, testnet = false } = options
  const { assets: availableAssets } = initImplementations()

  if (args.length !== 1) throw newInputError(`Expected one argument: The wallet ID. Got ${args.length}.`)
  if (!asset) throw newInputError(`No asset passed. Use --asset.`)
  if (!availableAssets.find(availableAsset => availableAsset.id === asset)) throw newInputError(`Unknown asset: ${asset}`)
  if (!privateKey) throw newInputError(`No private key passed. Use --private-key.`)

  const store = await loadOrCreateStore(keyStorePath)

  const presentWalletIDs = store.getWalletIDs()
  if (presentWalletIDs.includes(walletId)) throw newInputError(`Wallet '${walletId}' exists already.`)

  // TODO: Let network implementation do a sanity check on the private key

  const password = await readPassword()
  // TODO: Warn if password is insecure

  await store.saveWallet(walletId, password, { privateKey })
  await store.saveWalletPublicData(walletId, { asset, testnet })

  if (testnet) {
    console.log(`Wallet added: ${walletId}`)
  } else {
    console.log(`Testnet wallet added: ${walletId}`)
  }
}

async function readPassword () {
  const password = await prompt.password(`Password: `)
  const repeatedPassword = await prompt.password(`Repeat password: `)

  if (repeatedPassword !== password) throw newInputError(`Passwords do not match.`)
  return password
}
