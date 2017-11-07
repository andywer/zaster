import { error as formatError, grey } from './formats'

export function newInputError (message: string) {
  return Object.assign(new Error(message), { type: 'InputError' })
}

export function isInputError (error: any) {
  return error instanceof Error && error['type'] === 'InputError'
}

export function handleCLIError (error) {
  if (isInputError(error)) {
    console.error(formatError(error.message))
  } else if (error.stack) {
    const [ messageLine, ...stackLines ] = error.stack.split('\n')
    console.error(formatError(messageLine))
    console.error(grey(stackLines.join('\n')))
  } else {
    console.error(formatError(error))
  }
  process.exit(1)
}
