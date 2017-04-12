/**
 * Production config file for webpack
 * Creates two bundles:
 * 1. bundle.js -> Our application
 * 2. vendor.js -> Vendor bundle containing libraries
 *
 */
var path = require('path');
var Webpack = require('webpack');
var buildPath = path.resolve(__dirname, 'dist');

module.exports = {
  /**
   *  Key, value config defining the entry points to our application.
   *  1. bundle entry contains everything that is required by ./app/index.ts and its' descendants
   *  2. vendor entry contains vendor libraries from node_modules. Every time for example react is
   *  required/imported webpack replaces that with a module from our vendor bundle
   *
   *  We can define as many entry points as we want. This way we can split out our application to
   *  different pages and include only needed code to those pages.
   */
  entry: {
    index: './app/front/index.js',
    vendor: ['core-js', 'react']
  },
  /**
   * The output defined contains only our bundle, the code from our application.
   * Created bundle will be output to /dist folder and will be called bundle.js
   * In case we would have multiple chunks we can simply name the output filename
   * as [name].js and the bundled file would be named after the key from entry config.
   * (See webpack.config.js for this.)
   */
  output: {
    path: buildPath,
    filename: '[name].js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  /**
   * Additional loaders that webpack will run against then bundle response creates.
   * For our production build we use babel and eslint.
   *
   * Babel transpiles ES6 and JSX files to ES5 javascript so response is compatible
   * to current browser versions.
   *
   * Eslint runs static analysis against our code and errors or warns in case
   * we have written possibly bad code.
   */
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.css$/, exclude: /node_modules/, loader: "style-loader!css-loader"},
      {test: /\.scss$/, exclude: /node_modules/, loader: "style-loader!css-loader!sass-loader"},
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'eslint-loader'}
    ]
  },
  // Eslint config file location
  eslint: {
    configFile: './.eslintrc'
  },

  /**
   * Our additional plugins to be used during the build process
   */
  plugins: [
    // Chunk plugin makes the work of pointing our chunked bundle to correct
    // vendor bundle location
    new Webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', Infinity),

    // Uglify JS minimizes our application bundle
    new Webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    }),

// Deduping removes duplicated dependencies in case we have accidentally
// required them multiple times. Decreases bundle size.
    new Webpack.optimize.DedupePlugin(),

    // NoErrors stops bundling in case our code errors out.
    new Webpack.NoErrorsPlugin()
  ]
}
;