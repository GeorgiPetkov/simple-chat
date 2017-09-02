const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const inProductionEnvironment = process.env.NODE_ENV === 'production';
const router = express.Router();

if (inProductionEnvironment) {
  router.get(/index\.html|main\.js|styles\.css/, (req, res) =>
    res.sendFile(path.join(__dirname, req.path)));
} else {
  const config = require('../webpack.config.js');
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src'
  });

  router.use(middleware);
  router.use(webpackHotMiddleware(compiler));
  router.get('/', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
}

module.exports = router;
