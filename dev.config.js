var merge = require('webpack-merge');
var common = require('./webpack.common.js');


module.exports = merge(common, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
});
