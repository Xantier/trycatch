/**
 * A Babel wrapper so we can use ES6 on our server configuration file
 * and subsequent files.
 * Babel transpiles ES6 and JSX to ES5 so node.js runtime is able to
 * understand it.
 *
 * After registering the babel hook, we call our development-server
 * application.
 */
/* eslint-disable */
require('babel-core/register')();
var devServer = require('./development-server');
devServer.run();
/* eslint-enable */