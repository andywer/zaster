import program from 'commander'
import { loadStore } from '@wallet/key-store'
import pkg from '../../package.json'
import { keyStorePath } from '../config'
import { newInputError, handleCLIError } from '../errors'

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

  if (args.length !== 1) throw newInputError(`Expected one argument: The wallet ID. Got ${args.length}.`)

  const store = await loadStore(keyStorePath)

  const presentWalletIDs = store.getWalletIDs()
  if (!presentWalletIDs.includes(walletId)) throw newInputError(`Wallet '${walletId}' not found.`)

  await store.removeWallet(walletId)

  console.log(`Wallet removed: ${walletId}`)
}
