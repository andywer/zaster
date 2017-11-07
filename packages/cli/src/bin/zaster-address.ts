import program = require('commander')
import center = require('center-align')
import * as qrcode from 'qrcode-terminal'
import { newInputError, handleCLIError } from '../errors'
import { initSDK } from '../sdk'

const pkg = require('../../package.json')

program
  .name('zaster')
  .usage('address <walletId>')
  .description('Show a wallet\'s address to receive payments.')
  .version(pkg.version)
  .parse(process.argv)

showAddress(program)
  .catch(handleCLIError)

async function showAddress ({ args }) {
  if (args.length !== 1) throw newInputError(`Expected exactly one argument: A wallet ID.`)

  const sdk = await initSDK()
  const [ walletID ] = args

  const walletIDs = sdk.wallets.getWalletIDs()
  if (!walletIDs.includes(walletID)) throw newInputError(`Wallet not found: ${walletID}`)

  const address = await sdk.ledger.getWalletAddress(walletID)
  const qrCodeString = await createQRCode(address)
  const width = process.stdout.columns ? Math.min(process.stdout.columns, 80) : undefined

  console.log(center(`${qrCodeString}\n${address}`, width))
}

async function createQRCode (data) {
  return new Promise(resolve => {
    qrcode.generate(data, { small: true }, output => resolve(output))
  })
}
