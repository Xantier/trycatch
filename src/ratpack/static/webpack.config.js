/**
 * Development config file for webpack
 * Creates two bundles:
 * 1. bundle.js -> Our application
 * 2. vendor.js -> Vendor bundle containing libraries
 *
 * Injects webpack-dev-server to our page so hot loading
 * of our application is possible.
 */

const path = require('path');
const Webpack = require('webpack');
const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
  /**
   * Key, value config defining the entry points to our application.
   * 1. Bundle entry contains our application entry point and webpack-dev-server entry points.
   * Dev-server is added to the bundle so our application can be hot reloaded while developing
   *
   * 2. vendor entry contains vendor libraries from node_modules. Every time for example react is
   * required/imported webpack replaces that with a module from our vendor bundle
   */
  entry: {
    index: [
      'webpack-dev-server/client?http://0.0.0.0:3000',
      'webpack/hot/dev-server',
      './app/front/index.js'
    ],
    vendor: ['core-js', 'react']
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  /**
   * Output files from our build process. [name].js (or [id].js) will create a file
   * based on the key value of entry point configuration.
   */
  output: {
    path: buildPath,
    filename: '[name].js',
    publicPath: '/static/dist/'
  },

  /**
   * Additional loaders that webpack will run against the bundle response creates.
   * For our production build we use babel and eslint.
   *
   * React hot loader implements hot loading functionality for our react components.
   * This way when running our development server (dev-server) we can modify files and
   * the dev-server will refresh our application keeping the state intact.
   *
   * Babel transpiles ES6 and JSX files to ES5 javascript so response is compatible
   * to current browser versions.
   *
   * Eslint runs static analysis against our code and errors or warns in case
   * we have written possibly bad code.
   */
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'react-hot-loader'},
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
   * We tell webpack to create a source map for our devtools. Source maps are supported
   * by both Chrome and Firefox.
   */
  devtool: 'source-map',

  /**
   * Our additional plugins to be used during the build process
   */
  plugins: [

    // HotModuleReplacement runs on our dev server and hot swap new code
    // when changes to the codebase is made during development
    new Webpack.HotModuleReplacementPlugin(),

    // NoErrors plugin makes sure that build process is run only when
    // there are no errors in the code.
    new Webpack.NoErrorsPlugin()
  ]
};