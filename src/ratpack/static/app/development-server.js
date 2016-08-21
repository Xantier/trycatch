import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from '../webpack.config';
/* eslint-disable */
export function run() {
  let bundleStart = null;
  const compiler = Webpack(config);

  compiler.plugin('compile', () => {
    console.log('Bundling...');
    bundleStart = Date.now();
  });

  compiler.plugin('done', () => {
    console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
  });

  const bundler = new WebpackDevServer(compiler, {
    publicPath: '/',
    proxy: [{
      path: /(?!\/dist\/.*js)$/,
      target: 'http://localhost:5050/'
    }],
    hot: true,
    quiet: false,
    noInfo: true,
    stats: {
      colors: true
    }
  });
  bundler.listen(3000, 'localhost', () => {
    console.log('Bundling project, please wait...');
  });
}
/* eslint-enable */