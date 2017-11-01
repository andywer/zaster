import test from 'ava'
import { Big as BigNumber } from 'big.js'
import got = require('got')
import { getAssets, getAddressBalance, getWalletBalance } from '../src'

const getAccountBalance = (restAccountData: any): string => restAccountData.balances.find(balance => balance.asset_type === 'native').balance

test('getAssets() returns asset', t => {
  const assets = getAssets()
  t.is(assets.length, 1)
  t.is(assets[0].id, 'XLM')
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
    readPublic: async () => ({ publicKey: address, testnet: true }),
    readPrivate: async () => ({}),
    savePublic: async () => {},
    savePrivate: async () => {}
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
    readPublic: async () => ({ publicKey: address, testnet: false }),
    readPrivate: async () => ({}),
    savePublic: async () => {},
    savePrivate: async () => {}
  }

  const restApiResponse: any = await got(`https://horizon.stellar.org/accounts/${address}`, { json: true })
  const restApiBalance = getAccountBalance(restApiResponse.body)

  const implementationBalance = await getWalletBalance(wallet)

  t.true(implementationBalance.gt(BigNumber(20)))
  t.is(implementationBalance.toFixed(7), restApiBalance)
})
