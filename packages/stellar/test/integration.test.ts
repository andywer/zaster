import test from 'ava'
import { Big as BigNumber } from 'big.js'
import { Keypair } from 'stellar-sdk'
import got = require('got')
import { OperationType } from '@wallet/platform-api'
import {
  createPrivateKey,
  createTransaction,
  getAssets,
  getAddressBalance,
  getWalletBalance,
  sendTransaction,
  signTransaction
} from '../src'

const getAccountBalance = (restAccountData: any): string => restAccountData.balances.find(balance => balance.asset_type === 'native').balance

const getBalanceFromHorizon = async (url: string): Promise<BigNumber> => {
  const restApiResponse: any = await got(url, { json: true })
  return BigNumber(await getAccountBalance(restApiResponse.body))
}

test('getAssets() returns asset', t => {
  const assets = getAssets()
  t.is(assets.length, 1)
  t.is(assets[0].id, 'XLM')
})

test('createPrivateKey() can create a private key', async t => {
  const privateKey = await createPrivateKey()
  t.is(typeof privateKey, 'string')
  t.regex(privateKey, /^S[A-Z0-9]{55}$/)
})

test('getAddressBalance() can retrieve a testnet balance', async t => {
  const address = 'GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W'

  const restApiBalance = await getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${address}`)
  const implementationBalance = await getAddressBalance(address, { testnet: true })

  t.true(implementationBalance.gt(BigNumber(20)))
  t.is(implementationBalance.toString(), restApiBalance.toString())
})

test('getAddressBalance() can retrieve a mainnet balance', async t => {
  const address = 'GDOOMATUOJPLIQMQ4WWXBEWR5UMKJW65CFKJJW3LV7XZYIEQHZPDQCBI'

  const restApiBalance = await getBalanceFromHorizon(`https://horizon.stellar.org/accounts/${address}`)
  const implementationBalance = await getAddressBalance(address)

  t.true(implementationBalance.gt(BigNumber(20)))
  t.is(implementationBalance.toString(), restApiBalance.toString())
})

test('getWalletBalance() can retrieve a testnet balance', async t => {
  const address = 'GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W'
  const wallet = {
    asset: { id: 'XLM', aliases: [], name: 'Stellar lumens' },
    id: 'test-wallet',
    readPublic: async () => ({ publicKey: address }),
    readPrivate: async () => ({ privateKey: '' }),
    savePublic: async () => {},
    savePrivate: async () => {},
    getOptions: async () => ({ testnet: true })
  }

  const restApiBalance = await getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${address}`)
  const implementationBalance = await getWalletBalance(wallet)

  t.true(implementationBalance.gt(BigNumber(20)))
  t.is(implementationBalance.toString(), restApiBalance.toString())
})

test('getWalletBalance() can retrieve a mainnet balance', async t => {
  const address = 'GDOOMATUOJPLIQMQ4WWXBEWR5UMKJW65CFKJJW3LV7XZYIEQHZPDQCBI'
  const wallet = {
    asset: { id: 'XLM', aliases: [], name: 'Stellar lumens' },
    id: 'test-wallet',
    readPublic: async () => ({ publicKey: address }),
    readPrivate: async () => ({ privateKey: '' }),
    savePublic: async () => {},
    savePrivate: async () => {},
    getOptions: async () => ({ testnet: false })
  }

  const restApiBalance = await getBalanceFromHorizon(`https://horizon.stellar.org/accounts/${address}`)
  const implementationBalance = await getWalletBalance(wallet)

  t.true(implementationBalance.gt(BigNumber(20)))
  t.is(implementationBalance.toString(), restApiBalance.toString())
})

test('getWalletBalance() returns a zero-balance if account has not yet been activated', async t => {
  const address = Keypair.random().publicKey()
  const wallet = {
    asset: { id: 'XLM', aliases: [], name: 'Stellar lumens' },
    id: 'test-wallet',
    readPublic: async () => ({ publicKey: address }),
    readPrivate: async () => ({ privateKey: '' }),
    savePublic: async () => {},
    savePrivate: async () => {},
    getOptions: async () => ({ testnet: true })
  }

  const balance = await getWalletBalance(wallet)
  t.true(BigNumber(0).eq(balance))
})

test('can create a tx that can be signed and sent', async t => {
  const keypair = Keypair.fromSecret('SAOSYEJDOSY6SO75MVG3JBJA3VQICOAYGM3A7KR6Y6TBEN44MPJVDKRR')
  const destination = 'GAJT6T3FDVO3QXIRZJWXBYB7DYXLXMUFNW3AXDS52GAQKNZ23UQAOJRW'

  const wallet = {
    asset: { id: 'XLM', aliases: [], name: 'Stellar lumens' },
    id: 'test-wallet',
    readPublic: async () => ({ publicKey: keypair.publicKey() }),
    readPrivate: async () => ({ privateKey: keypair.secret() }),
    savePublic: async () => {},
    savePrivate: async () => {},
    getOptions: async () => ({ testnet: true })
  }

  const [ initialSourceBalance, initialDestinationBalance ] = await Promise.all([
    getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${keypair.publicKey()}`),
    getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${destination}`)
  ])

  const transaction = await createTransaction(wallet, [
    { type: OperationType.Payment, amount: BigNumber(10), destination }
  ])
  const signedTransaction = await signTransaction(wallet, transaction)
  const sentTransaction = await sendTransaction(signedTransaction, { testnet: true })

  const [ resultingSourceBalance, resultingDestinationBalance ] = await Promise.all([
    getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${keypair.publicKey()}`),
    getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${destination}`)
  ])

  t.is(resultingSourceBalance.minus(initialSourceBalance).toString(), BigNumber(-10 -100e-7).toString())
  t.is(resultingDestinationBalance.minus(initialDestinationBalance).toString(), BigNumber(10).toString())
  t.deepEqual(transaction, sentTransaction)
})
