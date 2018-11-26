var path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const srcPath = subPath => path.join(__dirname, './', subPath);

module.exports = {
    mode: 'development',
    entry: './public/app/index.js',
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.css', '.html'],
        alias: {
            components: srcPath('components'),
            models: srcPath('models'),
            utils: srcPath('utils'),
            config: srcPath('config'),
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer({ browsers: ['Safari >= 8', 'last 2 versions'] })]
                        }
                    },
                ],
            },
        ],
    },
};