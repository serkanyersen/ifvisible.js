const path = require('path');
const webpack = require("webpack");

let config = {
    entry: {
        app: ['./src/main.ts']
    },
    watch: true,
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ifvisible.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [{
            test: /\.tsx?$/, loader: 'ts-loader'
        }]
    },
    plugins: [
        new webpack.optimize.DedupePlugin()
    ]
};

if (process.env.PURPOSE === "production") {
    console.log("Production Mode");
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
    config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
    config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());

    config.devtool = null;
    config.devServer = null;
    config.watch = false;
}

module.exports = config;