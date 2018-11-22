const path = require( 'path' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const extractSass = new ExtractTextPlugin( {
  filename: '../css/style-[name].css'
} );

function resolve( dir ) {
  return path.join( __dirname, '', dir );
}

module.exports = {
  entry: {
    customizer: './assets/vendors/epsilon-framework/customizer/customizer.ts',
    admin: './assets/vendors/epsilon-framework/admin/admin.ts',
    previewer: './assets/vendors/epsilon-framework/previewer/previewer.ts',
  },
  output: {
    path: path.resolve( __dirname, './assets/js/' ),
    publicPath: '/assets/js/',
    filename: 'epsilon-framework-[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [ /\.vue$/ ]
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.scss$/,
        use: extractSass.extract( {
          use: [
            {
              loader: 'css-loader'
            }, {
              loader: 'sass-loader'
            } ],
          // use style-loader in development
          fallback: 'style-loader'
        } )
      }
    ]
  },
  plugins: [
    extractSass
  ],
  resolve: {
    extensions: [ '.ts', '.js', '.vue', '.json' ],
    alias: {
      '@': resolve( 'assets/vendors/epsilon-framework' ),
      '@scss': resolve( 'assets/css/scss' ),
      '@img': resolve( 'assets/img' )
    }
  },
};

/**
 * Build Process
 * #1 - npm run dev
 * #2 - npm run watch
 * #3 - npm run prod
 *
 * Production builds are minified;
 */
if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';

  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
