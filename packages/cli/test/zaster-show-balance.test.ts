import test from 'ava'
import * as temp from 'temp'
import got = require('got')
import shell from './helpers/shell'

temp.track()

const getAccountBalance = restAccountData => restAccountData.balances.find(balance => balance.asset_type === 'native').balance
const stripTrailingZeros = balanceString => balanceString.replace(/\.?0+$/, '')

test('zaster-show-balance can show a stellar testnet address\' balance', async t => {
  const address = 'GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W'

  const [
    restApiResponse,
    { stdout, stderr }
  ] = await Promise.all([
    got(`https://horizon-testnet.stellar.org/accounts/${address}`, { json: true }),
    shell(`zaster show balance --raw --testnet XLM:${address}`)
  ])
  const restApiBalance = getAccountBalance(restApiResponse.body)

  t.is(stderr, '')
  t.is(stdout.trim(), stripTrailingZeros(restApiBalance))
})

test('zaster-show-balance can show a wallet\'s balance', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }

  const address = 'GDTH2DHOCDX6JKGDLGVKMZSW56LYLS6VJ44GTNVUYDIDOW2T7FMSAIOG'
  const input = 'samplePassword\nsamplePassword\n'

  await shell('zaster add sample-wallet --asset XLM --private-key SAPHFOY6HGP6UW6X6CTUL2Q7GQXHPLVLMSWSK3F72X2VG7FICHQEJ264 --no-password-repeat --testnet', { env, input })

  const [
    restApiResponse,
    { stdout, stderr }
  ] = await Promise.all([
    got(`https://horizon-testnet.stellar.org/accounts/${address}`, { json: true }),
    shell(`zaster show balance sample-wallet --raw`, { env })
  ])
  const restApiBalance = getAccountBalance(restApiResponse.body)

  t.is(stderr, '')
  t.is(stdout.trim(), stripTrailingZeros(restApiBalance))
})
