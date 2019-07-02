import { snakeCase } from 'lodash'

export const toUrlkey = ({ hostname, pathname }: { hostname: string; pathname: string }) =>
  snakeCase(`${hostname}_${pathname}`)
