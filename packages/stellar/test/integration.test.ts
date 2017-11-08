import test from 'ava'
import { Big as BigNumber } from 'big.js'
import { Keypair } from 'stellar-sdk'
import got = require('got')
import { createPrivateKey, getAssets, getAddressBalance, getWalletBalance } from '../src'

const getAccountBalance = (restAccountData: any): string => restAccountData.balances.find(balance => balance.asset_type === 'native').balance

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

  const restApiResponse: any = await got(`https://horizon-testnet.stellar.org/accounts/${address}`, { json: true })
  const restApiBalance = getAccountBalance(restApiResponse.body)

  const implementationBalance = await getAddressBalance(address, { testnet: true })

  t.true(implementationBalance.gt(BigNumber(20)))
  t.is(implementationBalance.toFixed(7), restApiBalance)
})

test('getAddressBalance() can retrieve a mainnet balance', async t => {
  const address = 'GDOOMATUOJPLIQMQ4WWXBEWR5UMKJW65CFKJJW3LV7XZYIEQHZPDQCBI'

  const restApiResponse: any = await got(`https://horizon.stellar.org/accounts/${address}`, { json: true })
  const restApiBalance = getAccountBalance(restApiResponse.body)

  const implementationBalance = await getAddressBalance(address)

  t.true(implementationBalance.gt(BigNumber(20)))
  t.is(implementationBalance.toFixed(7), restApiBalance)
})

test('getWalletBalance() can retrieve a testnet balance', async t => {
  const address = 'GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W'
  const wallet = {
    asset: { id: 'XLM', aliases: [], name: 'Stellar lumens' },
    readPublic: async () => ({ publicKey: address }),
    readPrivate: async () => ({ privateKey: '' }),
    savePublic: async () => {},
    savePrivate: async () => {},
    getOptions: async () => ({ testnet: true })
  }

  const restApiResponse: any = await got(`https://horizon-testnet.stellar.org/accounts/${address}`, { json: true })
  const restApiBalance = getAccountBalance(restApiResponse.body)

  const implementationBalance = await getWalletBalance(wallet)

  t.true(implementationBalance.gt(BigNumber(20)))
  t.is(implementationBalance.toFixed(7), restApiBalance)
})

test('getWalletBalance() can retrieve a mainnet balance', async t => {
  const address = 'GDOOMATUOJPLIQMQ4WWXBEWR5UMKJW65CFKJJW3LV7XZYIEQHZPDQCBI'
  const wallet = {
    asset: { id: 'XLM', aliases: [], name: 'Stellar lumens' },
    readPublic: async () => ({ publicKey: address }),
    readPrivate: async () => ({ privateKey: '' }),
    savePublic: async () => {},
    savePrivate: async () => {},
    getOptions: async () => ({ testnet: false })
  }

  const restApiResponse: any = await got(`https://horizon.stellar.org/accounts/${address}`, { json: true })
  const restApiBalance = getAccountBalance(restApiResponse.body)

  const implementationBalance = await getWalletBalance(wallet)

  t.true(implementationBalance.gt(BigNumber(20)))
  t.is(implementationBalance.toFixed(7), restApiBalance)
})

test('getWalletBalance() returns a zero-balance if account has not yet been activated', async t => {
  const address = Keypair.random().publicKey()
  const wallet = {
    asset: { id: 'XLM', aliases: [], name: 'Stellar lumens' },
    readPublic: async () => ({ publicKey: address }),
    readPrivate: async () => ({ privateKey: '' }),
    savePublic: async () => {},
    savePrivate: async () => {},
    getOptions: async () => ({ testnet: true })
  }

  const balance = await getWalletBalance(wallet)
  t.true(BigNumber(0).eq(balance))
})
