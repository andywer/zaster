import { Keypair, TransactionBuilder, Asset as StellarAsset, Operation as StellarOperation } from 'stellar-sdk'
import { Operation, Wallet, OperationType, PaymentOperation } from '@wallet/platform-api'
import { getHorizonServer, retrieveAccountData, useNetwork } from './horizon'

export type StellarTransaction = any

export async function createTransaction (wallet: Wallet, operations: Operation[], options = {}): Promise<StellarTransaction> {
  const { privateKey }: { privateKey: string } = await wallet.readPrivate()
  const { testnet } = await wallet.getOptions()

  const keypair = Keypair.fromSecret(privateKey)
  const account = await retrieveAccountData(keypair.publicKey(), { testnet })

  const transaction = buildTransaction(account, operations)

  return transaction
}

export async function signTransaction (wallet: Wallet, transaction: StellarTransaction): Promise<StellarTransaction> {
  const { privateKey }: { privateKey: string } = await wallet.readPrivate()
  const keypair = Keypair.fromSecret(privateKey)

  transaction.sign(keypair)
  return transaction
}

export async function sendTransaction (transaction: StellarTransaction, options: { testnet?: boolean } = {}): Promise<StellarTransaction> {
  const testnet = Boolean(options.testnet)
  const horizon = getHorizonServer({ testnet })

  useNetwork({ testnet })
  await horizon.submitTransaction(transaction)

  return transaction
}

function buildTransaction (account, operations: Operation[]) {
  const builder = new TransactionBuilder(account)

  for (const operation of operations) {
    builder.addOperation(createStellarOperation(operation))
  }

  const transaction = builder.build()
  return transaction
}

function createStellarOperation (operation: Operation) {
  if (operation.type === OperationType.Payment) {
    return createPaymentOperation(operation as PaymentOperation)    // tslint:disable-line
  } else {
    throw new Error(`Cannot create stellar operation: Unhandled operation type ${operation.type}.`)
  }
}

function createPaymentOperation (operation: PaymentOperation) {
  return StellarOperation.payment({
    asset: StellarAsset.native(),
    destination: operation.destination,
    amount: operation.amount.toString()
  })
}
