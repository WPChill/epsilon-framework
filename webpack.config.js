/**
 * Define constants
 */
const path = require('path');

const webpack = require('webpack');
/**
 * Extract text plugin (used in production)
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
/**
 * Remove files from the JS/CSS folders on new builds
 * @type {CleanWebpackPlugin}
 */
const CleanWebpackPlugin = require('clean-webpack-plugin');
/**
 * Used to clean obsolete chunks during watch ( which the above plugin doesnt do )
 */
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');

const TerserPlugin = require('terser-webpack-plugin');

/**
 * Extract sass and create css files with it
 */
const extractSass =
    new ExtractTextPlugin({
        filename: '../css/style-[name].css'
    });

function resolve(dir) {
    return path.join(__dirname, '', dir);
}

module.exports = {
    entry: {
        customizer: './assets/vendors/epsilon-framework/customizer/customizer.ts',
        admin: './assets/vendors/epsilon-framework/admin/admin.ts',
        previewer: './assets/vendors/epsilon-framework/previewer/previewer.ts',
    },
    /**
     * Output of the newly created file
     */
    output: {
        path: path.resolve(__dirname, './assets/js/'),
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
                    appendTsSuffixTo: [/\.vue$/]
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
                use: extractSass.extract({
                    use: [
                        {
                            loader: 'css-loader'
                        }, {
                            loader: 'sass-loader'
                        }],
                    // use style-loader in development
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    plugins: [
        extractSass,
        /**
         * Cleans js and css folders when running build
         */
        new CleanWebpackPlugin(
            ['assets/js']
        ),
        /**
         * Clean obsolete chunks during watch mode
         */
        new CleanObsoleteChunks(),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            '@': resolve('assets/vendors/epsilon-framework'),
            '@scss': resolve('assets/css/scss'),
            '@img': resolve('assets/img')
        }
    },
    /**
     * Optimization
     */
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            }
        },
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
        ],
    }
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            options: {
                postcss: [autoprefixer()],
            },
        }),
    ]);
}