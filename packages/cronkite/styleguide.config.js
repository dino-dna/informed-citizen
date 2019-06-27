const { resolve } = require('path')

module.exports = {
  propsParser: require('react-docgen-typescript').withCustomConfig('./tsconfig.json').parse,
  components: 'src/ui/components/**/*.tsx',
  webpackConfig: require('./node_modules/react-scripts/config/webpack.config.js'),
  require: [
    resolve(__dirname, 'node_modules/papercss/dist/paper.css')
  ]
}
