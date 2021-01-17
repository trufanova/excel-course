const path = require('path') //здесь создаем переменную из стандартного пакета node
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // Плагин для копирования файлов из src в dist. Например фавиконку
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`

const jsLoaders = () => {
    const loaders = [{            
        loader: "babel-loader",
        options: {
            presets: ['@babel/preset-env']
        }  
    } 
    ]
    if (isDev) {
        loaders.push('eslint-loader')
    }
    return loaders
}

module.exports = {
    context: path.resolve(__dirname, 'src'), // здесь пишем папку с исхдниками, чтобы постоянно не писать к ней путь. Т.е. это как бы будет текущий контекст.
    mode: 'development', // мы устанавливаем режим по-умолчанию разработка, чтобы в консоли писать чуть меньше кода
    target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
    entry: ['@babel/polyfill','./index.js'], //здесь указываем входные точки для приложения
    output: { //здесь пишем настройки для выходных файлов
        filename: filename('js'), //Это имя файла, [hash] нужен, чтобы избежать проблем с кэшированием. Теперь к имени выходного файла будут добавляться цифры из хэша и он будет уникальным.
        path: path.resolve(__dirname, 'dist') //метод path.resolve вернет нам абсолютный путь к выходному файлу
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@core': path.resolve(__dirname, 'src/core')

        }
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
        port: 4200,
        hot: isDev,
        overlay: true,
        open: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: 'index.html',
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd
            }
        }),
        new CopyPlugin({
            patterns: [
              { 
                from: path.resolve(__dirname, 'src/favicon.ico'), 
                to: path.resolve(__dirname, 'dist') }
            ],
          }),
          new MiniCssExtractPlugin({
              filename: filename('css')
          })
    ],
    module: {
        rules: [
             {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            },
                            // hmr: isDev,
                            // reloadAll: true
                        },
                    },
                    "css-loader",
                    "sass-loader",
                ],
            }, 

            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders(),

            }
        ],
    }
}