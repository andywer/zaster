import program = require('commander')
import { Big as BigNumber } from 'big.js'
import { OperationType } from '@wallet/sdk'
import { newInputError, handleCLIError } from '../errors'
import { green } from '../formats'
import { initSDK } from '../sdk'

const pkg = require('../../package.json')

const collectOptions = (value, memo) => {
  memo.push(value)
  return memo
}

program
  .name('zaster')
  .usage('send-transaction <walletId> --payment "<amount> to <address|walletID>"')
  .description('Create and send a transaction.')
  .option('--payment <payment>', 'Add payment operation.', collectOptions, [])
  .version(pkg.version)
  .parse(process.argv)

sendTransaction(program)
  .catch(handleCLIError)

async function sendTransaction ({ args, payment: payments = [] }) {
  if (args.length !== 1) throw newInputError(`Expected exactly one argument: A wallet ID.`)

  const sdk = await initSDK()
  const [ walletID ] = args

  const walletIDs = sdk.wallets.getWalletIDs()
  if (!walletIDs.includes(walletID)) throw newInputError(`Wallet not found: ${walletID}`)

  const operations = payments.map((payment: string) => {
    const [ amountString, destination ] = payment.split(' to ').map(splitString => splitString.trim())
    return { type: OperationType.Payment, amount: BigNumber(amountString), destination }
  })

  const transaction = await sdk.ledger.createTransaction(walletID, operations)
  const signedTransaction = await sdk.ledger.signTransaction(walletID, transaction)

  await sdk.ledger.sendTransaction(signedTransaction)

  console.log(green(`Transaction successfully sent.`))
  process.exit(0)
}
