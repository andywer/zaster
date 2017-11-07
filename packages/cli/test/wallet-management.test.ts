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

test('zaster-ls can list a previously added wallet', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }
  const input = 'samplePassword\nsamplePassword\n'

  await shell('zaster add sample-wallet --asset XLM --private-key SBM2CIOD7RLPMOXMZ7E57J4O6DEH7RWORM7CWK5PPYBT5NRBDDAGPZUC --no-password-repeat', { env, input })
  const { stdout, stderr } = await shell('zaster ls', { env })

  t.is(stderr, '')
  t.snapshot(stripAnsi(stdout).trim())
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