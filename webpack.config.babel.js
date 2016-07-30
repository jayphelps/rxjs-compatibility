import webpack from 'webpack';

const env = process.env.NODE_ENV;

const config = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'RxCompatibility',
    libraryTarget: 'umd'
  },
  externals: {
    'rxjs/Observable': {
      root: 'RxV5',
      commonjs2: 'rxjs',
      commonjs: 'rxjs',
      amd: 'rxjs'
    },
    'rx': {
      root: 'RxV4',
      commonjs2: 'rx',
      commonjs: 'rx',
      amd: 'rx'
    }
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
};

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
