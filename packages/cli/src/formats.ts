import * as chalk from 'chalk'

const green = chalk.green
const grey = chalk.grey

const asset = chalk.blue
const balance = (balance, assetID) => `${asset(assetID)} ${chalk.bold(balance.toString())}`

export {
  asset,
  balance,
  green,
  grey
}
