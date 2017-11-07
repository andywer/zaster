import test from 'ava'
import stripAnsi = require('strip-ansi')
import shell from './helpers/shell'

test('zaster-assets shows supported assets', async t => {
  const { stdout, stderr } = await shell('zaster assets')

  t.is(stderr, '')
  t.snapshot(stripAnsi(stdout).trim())
})
