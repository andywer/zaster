import * as path from 'path'
import execa = require('execa')

const pkg = require('../../package.json')
const walletToolPath = path.join(__dirname, '..', '..', pkg.bin.zaster)

export default function shell (command, options = {}) {
  command = command.replace(/^zaster\b/, `node ${walletToolPath}`)
  return execa.shell(command, options)
}
