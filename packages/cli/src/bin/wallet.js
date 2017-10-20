#!/usr/bin/env node

import program from 'commander'
import pkg from '../../package.json'

program
  .command('assets', 'List supported crypto coins.')
  .command('ls', 'List all wallets.')
  .command('add', 'Add a wallet by private key.')
  .version(pkg.version)
  .parse(process.argv)
