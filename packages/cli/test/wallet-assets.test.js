import test from 'ava'
import chalk from 'chalk'
import stripAnsi from 'strip-ansi'
import shell from './helpers/shell'

test('wallet-assets shows supported assets', async t => {
  const { stdout, stderr } = await shell('wallet assets')

  t.is(stderr, '')
  t.snapshot(stripAnsi(stdout).trim())
})