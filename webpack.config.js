const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require("autoprefixer");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const $proxy = 'https://test.dev.gabrielsevigny.com';

module.exports = {
    context: __dirname,
    entry: {
        main: [
            './src/js/main.js',
            './src/scss/style.scss',
            './src/scss/admin.scss',
            // './src/scss/editor.scss'
        ]
    },

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'assets/js'),
        chunkFilename: "vendors.bundle.js"
    },
    externals: {
        jquery: 'jQuery',
        $: 'jQuery'
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                exclude: /node_modules/,
                test: /\.jsx$/,
                loader: 'eslint-loader'
            },
            {
                test: /\.?js$/,
                exclude: /(node_modules|bower_components|libs)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        //cacheDirectory: false,
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '../css/[name].css',
                        }
                    },
                    'extract-loader',
                    // MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()]
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '../css/[name].css',
                        }
                    },
                    'extract-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()]
                        }
                    }]
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                options: {
                    extract: true,
                    spriteFilename: 'svg-defs.svg'
                }
            },
            {
                test: /\.(jpe?g|png|gif)\$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images/',
                            name: '[name].[ext]'
                        }
                    },
                    'img-loader'
                ]
            }
        ],

    },

    plugins: [

        // new StyleLintPlugin(),
        // new MiniCssExtractPlugin(),
        new BrowserSyncPlugin({
            files: '**/*.(php|poe)',
            injectChanges: true,
            proxy: $proxy
        }),
        //notifications
        new WebpackNotifierPlugin({
            title: 'Le projet a été mis a jour',
            //contentImage: path.join(__dirname, 'src/js_icon.png'),
            contentImage: false,
            sound: 'Pop', // true, false, Sound can be one of these: Basso, Blow, Bottle, Frog, Funk, Glass, Hero, Morse, Ping, Pop, Purr, Sosumi, Submarine, Tink
            open: 'https://gabrielsevigny.com', //URL vers la redirection doit allez
            icon: path.join(__dirname, 'src/js_icon.png'),
        }),

    ],

    optimization: {
        splitChunks: { //Permets d'importer des librairies nodes si utilisé dans le projet afin d'éviter de les avoir dans plus d'un bundle
            cacheGroups: {
                node_vendors: {
                    test: /[\\/]node_modules|libs[\\/]/,
                    chunks: 'all',
                    priority: 1,
                },
            },
            chunks(chunk) {
                return chunk.name
            }
        },
        minimizer: [new UglifyJsPlugin(), new OptimizeCssAssetsPlugin()]
    },
    //devtool: 'source-map'
    devtool: 'cheap-eval-source-map',
};