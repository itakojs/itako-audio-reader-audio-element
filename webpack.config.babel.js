import webpack from 'webpack';
import { name } from './package.json';
import pascalCase from 'pascal-case';

const config = {
  entry: './src',
  output: {
    path: `${__dirname}/lib/`,
    filename: 'index.js',
    library: pascalCase(name),
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'transform?brfs',
          'babel',
        ],
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.json'],
  },
  devServer: {
    contentBase: 'release',
    noInfo: true,
    quiet: true,
  },
};

switch (process.env.NODE_ENV) {
  case 'production':
    config.plugins = [
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    ];

    config.devtool = '#source-map';
    break;

  default:
    config.devtool = 'inline-source-map';
}

export default config;
