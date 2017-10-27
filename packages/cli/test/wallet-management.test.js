import test from 'ava'
import { loadStore } from 'key-store'
import stripAnsi from 'strip-ansi'
import temp from 'temp'
import shell from './helpers/shell'

temp.track()

test('wallet-add can add a wallet', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\n'

  const { stdout, stderr } = await shell('wallet add sample-wallet --asset XLM --private-key ABCD --no-password-repeat', { env, input })
  t.is(stderr, '')

  const keyStore = await loadStore(keyStorePath)
  t.deepEqual(keyStore.getWalletIDs(), ['sample-wallet'])
  t.deepEqual(await keyStore.readWallet('sample-wallet', 'samplePassword'), { privateKey: 'ABCD' })
  t.deepEqual(await keyStore.readWalletPublicData('sample-wallet'), { asset: 'XLM', testnet: false })

  t.snapshot(stripAnsi(stdout).trim())
})

test('wallet-add can add a testnet wallet', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\nsamplePassword\n'

  const { stdout, stderr } = await shell('wallet add sample-wallet --asset XLM --private-key ABCD --testnet --no-password-repeat', { env, input })

  const keyStore = await loadStore(keyStorePath)
  t.deepEqual(keyStore.getWalletIDs(), ['sample-wallet'])
  t.deepEqual(await keyStore.readWallet('sample-wallet', 'samplePassword'), { privateKey: 'ABCD' })
  t.deepEqual(await keyStore.readWalletPublicData('sample-wallet'), { asset: 'XLM', testnet: true })
})

test('wallet-ls can list a previously added wallet', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\nsamplePassword\n'

  await shell('wallet add sample-wallet --asset XLM --private-key ABCD --no-password-repeat', { env, input })
  const { stdout, stderr } = await shell('wallet ls', { env })

  t.is(stderr, '')
  t.snapshot(stripAnsi(stdout).trim())
})

test('wallet-rm can remove a previously added wallet', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\nsamplePassword\n'

  await shell('wallet add sample-wallet --asset XLM --private-key ABCD --testnet --no-password-repeat', { env, input })
  const { stdout, stderr } = await shell('wallet rm sample-wallet', { env })
  t.is(stderr, '')

  const keyStore = await loadStore(keyStorePath)
  t.deepEqual(keyStore.getWalletIDs(), [])

  t.snapshot(stripAnsi(stdout).trim())
})
