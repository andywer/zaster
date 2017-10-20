import chalk from 'chalk'

export function newInputError (message) {
  return Object.assign(new Error(message), { type: 'InputError' })
}

export function isInputError (error) {
  return error instanceof Error && error.type === 'InputError'
}

export function handleCLIError (error) {
  if (isInputError(error)) {
    console.error(chalk.red(error.message))
  } else if (error.stack) {
    const [ messageLine, ...stackLines ] = error.stack.split('\n')
    console.error(chalk.red(messageLine))
    console.error(chalk.grey(stackLines.join('\n')))
  } else {
    console.error(chalk.red(error))
  }
  process.exit(1)
}
