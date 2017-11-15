import test from 'ava'
import { Big as BigNumber } from 'big.js'
import * as temp from 'temp'
import got = require('got')
import shell from './helpers/shell'

temp.track()

const getAccountBalance = restAccountData => restAccountData.balances.find(balance => balance.asset_type === 'native').balance
const stripTrailingZeros = balanceString => balanceString.replace(/\.?0+$/, '')

const getBalanceFromHorizon = async (url: string): Promise<BigNumber> => {
  const response = await got(url, { json: true })
  return BigNumber(getAccountBalance(response.body))
}

test('zaster-send-transaction can make a payment', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }

  const sourceAddress = 'GDA5LHH5WEUSCA4GKPL6VP3PPM7X5TGASACBQ4JJNEYSJQL4N3MMVSPF'
  const destination = 'GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W'
  const passwordInput = 'samplePassword\nsamplePassword\n'

  await shell('zaster add sample-wallet --asset XLM --private-key SAOSYEJDOSY6SO75MVG3JBJA3VQICOAYGM3A7KR6Y6TBEN44MPJVDKRR --no-password-repeat --testnet', { env, input: passwordInput.repeat(2) })

  const [ initialSourceBalance, initialDestinationBalance ] = await Promise.all([
    getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${sourceAddress}`),
    getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${destination}`)
  ])

  const { stdout, stderr } = await shell(`zaster send-transaction sample-wallet --payment '10.0 to ${destination}'`, { env, input: passwordInput })
  t.is(stderr, '')

  const [ resultingSourceBalance, resultingDestinationBalance ] = await Promise.all([
    getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${sourceAddress}`),
    getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${destination}`)
  ])

  t.is(resultingSourceBalance.minus(initialSourceBalance).toString(), BigNumber(-10 -100e-7).toString())
  t.is(resultingDestinationBalance.minus(initialDestinationBalance).toString(), BigNumber(10).toString())
  t.snapshot(stdout.trim())
})
