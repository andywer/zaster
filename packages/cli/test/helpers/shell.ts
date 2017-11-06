import * as path from 'path'
import execa = require('execa')

const pkg = require('../../package.json')
const walletToolPath = path.join(__dirname, '..', '..', pkg.bin.wallet)

export default function shell (command, options = {}) {
  command = command.replace(/^wallet\b/, `node ${walletToolPath}`)
  return execa.shell(command, options)
}
