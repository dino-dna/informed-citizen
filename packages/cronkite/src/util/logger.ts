import pino from 'pino'

export function create (opts: pino.LoggerOptions) {
  return pino(opts)
}

export type Logger = ReturnType<typeof create>
