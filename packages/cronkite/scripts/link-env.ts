import { link } from 'fs'
import path from 'path'
const SRC_ENV_FILENAME = path.resolve(__dirname, '..', '..', '..', 'informed.env')
const TARGET_ENV_FILENAME = path.resolve(__dirname, '..', '.env')

link(SRC_ENV_FILENAME, TARGET_ENV_FILENAME, err => {
  const isEnvFilePreexisting = err && err.code && err.code.match(/exist/i)
  if (err && !isEnvFilePreexisting) throw err
  console.log('.env file ok')
})

link(`${SRC_ENV_FILENAME}.example`, `${TARGET_ENV_FILENAME}.example`, err => {
  const isEnvFilePreexisting = err && err.code && err.code.match(/exist/i)
  if (err && !isEnvFilePreexisting) throw err
  console.log('.env.example file ok')
})
