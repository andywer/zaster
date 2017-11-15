import test from 'ava'
import { Big as BigNumber } from 'big.js'
import { Keypair } from 'stellar-sdk'
import * as temp from 'temp'
import retry = require('async-retry')
import got = require('got')
import shell from './helpers/shell'

temp.track()

const getAccountBalance = restAccountData => restAccountData.balances.find(balance => balance.asset_type === 'native').balance
const stripTrailingZeros = balanceString => balanceString.replace(/\.?0+$/, '')

const getBalanceFromHorizon = async (url: string): Promise<BigNumber> => {
  const response = await got(url, { json: true })
  return BigNumber(getAccountBalance(response.body))
}

const topUpByFriendbot = async (address: string): Promise<any> => {
  return retry(
    async () => got(`https://horizon-testnet.stellar.org/friendbot?addr=${address}`),
    { minTimeout: 250, retries: 5 }
  )
}

test('zaster-send-transaction can make a payment', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }

  const sourceKeypair = Keypair.random()
  const destinationKeypair = Keypair.random()

  const passwordInput = 'samplePassword\nsamplePassword\n'

  await Promise.all([
    topUpByFriendbot(sourceKeypair.publicKey()),
    topUpByFriendbot(destinationKeypair.publicKey())
  ])
  await shell(`zaster add sample-wallet --asset XLM --private-key ${sourceKeypair.secret()} --no-password-repeat --testnet`, { env, input: passwordInput.repeat(2) })

  const [ initialSourceBalance, initialDestinationBalance ] = await Promise.all([
    getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${sourceKeypair.publicKey()}`),
    getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${destinationKeypair.publicKey()}`)
  ])

  const { stdout, stderr } = await shell(`zaster send-transaction sample-wallet --payment '10.0 to ${destinationKeypair.publicKey()}'`, { env, input: passwordInput })
  t.is(stderr, '')

  const [ resultingSourceBalance, resultingDestinationBalance ] = await Promise.all([
    getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${sourceKeypair.publicKey()}`),
    getBalanceFromHorizon(`https://horizon-testnet.stellar.org/accounts/${destinationKeypair.publicKey()}`)
  ])

  t.is(resultingSourceBalance.minus(initialSourceBalance).toString(), BigNumber(-10 -100e-7).toString())
  t.is(resultingDestinationBalance.minus(initialDestinationBalance).toString(), BigNumber(10).toString())
  t.snapshot(stdout.trim())
})
