import test from 'ava'
import { loadStore } from 'key-store'
import * as temp from 'temp'
import stripAnsi = require('strip-ansi')
import shell from './helpers/shell'

temp.track()

test('zaster-add can add a wallet', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\n'

  const { stdout, stderr } = await shell('zaster add sample-wallet --asset XLM --private-key SBM2CIOD7RLPMOXMZ7E57J4O6DEH7RWORM7CWK5PPYBT5NRBDDAGPZUC --no-password-repeat', { env, input })
  t.is(stderr, '')

  const keyStore = await loadStore(keyStorePath)
  t.deepEqual(keyStore.getWalletIDs(), ['sample-wallet'])
  t.deepEqual(await keyStore.readWallet('sample-wallet', 'samplePassword'), {
    platform: {
      privateKey: 'SBM2CIOD7RLPMOXMZ7E57J4O6DEH7RWORM7CWK5PPYBT5NRBDDAGPZUC'
    }
  })
  t.deepEqual(await keyStore.readWalletPublicData('sample-wallet'), {
    asset: 'XLM',
    platform: {
      publicKey: 'GANG4WJRAFRWWJF55TBEWS7PRPMILWKDASEMO2O2KGLLDE7ZWSZTHIRR'
    },
    testnet: false
  })

  t.snapshot(stripAnsi(stdout).trim())
})

test('zaster-add can add a testnet wallet', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\nsamplePassword\n'

  const { stdout, stderr } = await shell('zaster add sample-wallet --asset XLM --private-key SBM2CIOD7RLPMOXMZ7E57J4O6DEH7RWORM7CWK5PPYBT5NRBDDAGPZUC --testnet --no-password-repeat', { env, input })

  const keyStore = await loadStore(keyStorePath)
  t.deepEqual(keyStore.getWalletIDs(), ['sample-wallet'])
  t.deepEqual(await keyStore.readWallet('sample-wallet', 'samplePassword'), {
    platform: {
      privateKey: 'SBM2CIOD7RLPMOXMZ7E57J4O6DEH7RWORM7CWK5PPYBT5NRBDDAGPZUC'
    }
  })
  t.deepEqual(await keyStore.readWalletPublicData('sample-wallet'), {
    asset: 'XLM',
    platform: {
      publicKey: 'GANG4WJRAFRWWJF55TBEWS7PRPMILWKDASEMO2O2KGLLDE7ZWSZTHIRR'
    },
    testnet: true
  })
})

test('zaster-create can create a new wallet', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\n'

  const { stdout, stderr } = await shell('zaster create sample-wallet --asset XLM --no-password-repeat', { env, input })
  t.is(stderr, '')

  const keyStore = await loadStore(keyStorePath)
  t.deepEqual(keyStore.getWalletIDs(), ['sample-wallet'])

  const privateData = await keyStore.readWallet('sample-wallet', 'samplePassword')
  const publicData = await keyStore.readWalletPublicData('sample-wallet')

  t.is(publicData.asset, 'XLM')
  t.is(publicData.testnet, false)
  t.regex(publicData.platform.publicKey, /^G[A-Z0-9]+$/)
  t.regex(privateData.platform.privateKey, /^S[A-Z0-9]+$/)

  t.snapshot(stripAnsi(stdout).trim())
})

test('zaster-create can create a new testnet wallet', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\n'

  const { stdout, stderr } = await shell('zaster create sample-wallet --asset XLM --testnet --no-password-repeat', { env, input })
  t.is(stderr, '')

  const keyStore = await loadStore(keyStorePath)
  t.deepEqual(keyStore.getWalletIDs(), ['sample-wallet'])

  const privateData = await keyStore.readWallet('sample-wallet', 'samplePassword')
  const publicData = await keyStore.readWalletPublicData('sample-wallet')

  t.is(publicData.asset, 'XLM')
  t.is(publicData.testnet, true)
  t.regex(publicData.platform.publicKey, /^G[A-Z0-9]+$/)
  t.regex(privateData.platform.privateKey, /^S[A-Z0-9]+$/)

  t.snapshot(stripAnsi(stdout).trim())
})

test('zaster-ls can list a previously added wallet', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\nsamplePassword\n'

  await shell('zaster add sample-wallet --asset XLM --private-key SBM2CIOD7RLPMOXMZ7E57J4O6DEH7RWORM7CWK5PPYBT5NRBDDAGPZUC --no-password-repeat', { env, input })
  const { stdout, stderr } = await shell('zaster ls', { env })

  t.is(stderr, '')
  t.snapshot(stripAnsi(stdout).trim())
})

test('zaster-ls sorts wallets', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\nsamplePassword\n'

  await shell('zaster add xyz --asset XLM --private-key SBM2CIOD7RLPMOXMZ7E57J4O6DEH7RWORM7CWK5PPYBT5NRBDDAGPZUC --no-password-repeat', { env, input })
  await shell('zaster add abc --asset XLM --private-key SBM2CIOD7RLPMOXMZ7E57J4O6DEH7RWORM7CWK5PPYBT5NRBDDAGPZUC --no-password-repeat', { env, input })
  const { stdout, stderr } = await shell('zaster ls --raw', { env })

  t.is(stderr, '')
  t.deepEqual(stdout.trim().split('\n').map(line => line.trim()), [ 'abc', 'xyz' ])
})

test('zaster-rm can remove a previously added wallet', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\nsamplePassword\n'

  await shell('zaster add sample-wallet --asset XLM --private-key SBM2CIOD7RLPMOXMZ7E57J4O6DEH7RWORM7CWK5PPYBT5NRBDDAGPZUC --testnet --no-password-repeat', { env, input })
  const { stdout, stderr } = await shell('zaster rm sample-wallet', { env })
  t.is(stderr, '')

  const keyStore = await loadStore(keyStorePath)
  t.deepEqual(keyStore.getWalletIDs(), [])

  t.snapshot(stripAnsi(stdout).trim())
})

test('zaster-backup can print a wallet\'s private key', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\nsamplePassword\n'

  await shell('zaster add sample-wallet --asset XLM --private-key SBM2CIOD7RLPMOXMZ7E57J4O6DEH7RWORM7CWK5PPYBT5NRBDDAGPZUC --testnet --no-password-repeat', { env, input })
  const { stdout, stderr } = await shell('zaster backup sample-wallet', { env, input: 'samplePassword\n' })
  t.is(stderr, '')

  t.is(stdout.trim().replace(/^[\S\s]+\s([A-Z0-9]+)$/, '$1'), 'SBM2CIOD7RLPMOXMZ7E57J4O6DEH7RWORM7CWK5PPYBT5NRBDDAGPZUC')
  t.snapshot(stripAnsi(stdout).trim())
})
