import test from 'ava'
import got from 'got'
import shell from './helpers/shell'

const getAccountBalance = restAccountData => restAccountData.balances.find(balance => balance.asset_type === 'native').balance

test('wallet-show-balance can show a stellar testnet address\' balance', async t => {
  const address = 'GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W'

  const [
    restApiResponse,
    { stdout, stderr }
  ] = await Promise.all([
    got(`https://horizon-testnet.stellar.org/accounts/${address}`, { json: true }),
    shell(`wallet show balance --testnet XLM:${address}`)
  ])
  const restApiBalance = getAccountBalance(restApiResponse.body)

  t.is(stderr, '')
  t.is(stdout.trim(), restApiBalance.replace(/0+$/, ''))
})
