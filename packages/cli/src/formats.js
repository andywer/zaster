import chalk from 'chalk'

const grey = chalk.grey

const asset = chalk.blue
const balance = (balance, assetID) => `${asset(assetID)} ${chalk.bold(balance.toString())}`

export {
  asset,
  balance,
  grey
}
