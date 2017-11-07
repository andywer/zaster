import test from 'ava'
import * as temp from 'temp'
import got = require('got')
import shell from './helpers/shell'

temp.track()

test('zaster-address can show a stellar account\'s public key', async t => {
  const keyStorePath = temp.path()
  const env = { WALLET_STORE_PATH: keyStorePath }

  const address = 'GDTH2DHOCDX6JKGDLGVKMZSW56LYLS6VJ44GTNVUYDIDOW2T7FMSAIOG'
  const input = 'samplePassword\nsamplePassword\n'

  await shell('zaster add sample-wallet --asset XLM --private-key SAPHFOY6HGP6UW6X6CTUL2Q7GQXHPLVLMSWSK3F72X2VG7FICHQEJ264 --no-password-repeat --testnet', { env, input })
  const { stdout, stderr } = await shell('zaster address sample-wallet', { env })

  t.is(stderr, '')
  t.is(stdout.trim().replace(/^[\S\s]+\s([A-Z0-9]+)$/, '$1'), address)
  t.snapshot(stdout)
})

