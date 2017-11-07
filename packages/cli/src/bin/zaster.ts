#!/usr/bin/env node

import program = require('commander')

const pkg = require('../../package.json')

program
  .command('assets', 'List supported crypto coins.')
  .command('ls', 'List all wallets.')
  .command('add', 'Add a wallet by private key.')
  .command('rm', 'Remove a wallet.')
  .command('address', 'Show a wallet\'s address to receive payments.')
  .command('show', 'Show a balance, transaction, ...')
  .version(pkg.version)
  .parse(process.argv)
