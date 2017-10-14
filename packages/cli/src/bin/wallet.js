#!/usr/bin/env node

import program from 'commander'
import pkg from '../../package.json'

program
  .command('assets', 'List supported crypto coins.')
  .version(pkg.version)
  .parse(process.argv)
