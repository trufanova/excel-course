const path = require('path') //здесь создаем переменную из стандартного пакета node
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // Плагин для копирования файлов из src в dist. Например фавиконку
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    context: path.resolve(__dirname, 'src'), // здесь пишем папку с исхдниками, чтобы постоянно не писать к ней путь. Т.е. это как бы будет текущий контекст.
    mode: 'development', // мы устанавливаем режим по-умолчанию разработка, чтобы в консоли писать чуть меньше кода
    entry: './index.js', //здесь указываем входные точки для приложения
    output: { //здесь пишем настройки для выходных файлов
        filename: 'bundle.[hash].js', //Это имя файла, [hash] нужен, чтобы избежать проблем с кэшированием. Теперь к имени выходного файла будут добавляться цифры из хэша и он будет уникальным.
        path: path.resolve(__dirname, 'dist') //метод path.resolve вернет нам абсолютный путь к выходному файлу
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: 'index.html'
        })
    ]
}