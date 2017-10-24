import execa from 'execa'
import path from 'path'
import pkg from '../../package.json'

const walletToolPath = path.join(__dirname, '..', '..', pkg.bin.wallet)

export default function shell (command, options = {}) {
  command = command.replace(/^wallet\b/, `node ${walletToolPath}`)
  return execa.shell(command, options)
}
