export const isDev = process.env.NODE_ENV === 'development'
export const isTest = process.env.NODE_ENV === 'test'
export const isProd = !isDev && !isTest
export * from './article'
export * from './analysis'
