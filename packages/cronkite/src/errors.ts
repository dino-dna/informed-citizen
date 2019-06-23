export class CronkiteError extends Error {
  static status: number
  static defaultMessage: string
}
export class WebAppError extends CronkiteError {}
export class WebAppUnavailableError extends CronkiteError {}
WebAppUnavailableError.status = 503
WebAppUnavailableError.defaultMessage = 'Service unavailable'

export class ApiError extends CronkiteError {}
export class Api400 extends ApiError {}
Api400.status = 400
Api400.defaultMessage = 'Invalid request'
export class Api401 extends ApiError {}
Api401.status = 401
Api401.defaultMessage = 'Unauthorized'
export class Api404 extends ApiError {}
Api404.status = 404
Api404.defaultMessage = 'Not found'
export class Api409 extends ApiError {}
Api409.status = 409
Api409.defaultMessage = 'Conflict'
export class Api500 extends ApiError {}
Api500.status = 500
Api500.defaultMessage = 'Internal error.  File a bug to us, please!'
export class Api503 extends ApiError {}
Api500.status = 503
Api500.defaultMessage = 'Service unavailable'
