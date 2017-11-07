import * as chalk from 'chalk'

const green = chalk.green
const grey = chalk.grey

const asset = chalk.blue
const balance = (balance, assetID) => `${asset(assetID)} ${chalk.bold(balance.toString())}`
const error = chalk.red

export {
  asset,
  balance,
  error,
  green,
  grey
}
