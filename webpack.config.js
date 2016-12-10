const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const version = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"))).version;
const WebpackShellPlugin = require("webpack-shell-plugin");

let config = {
    entry: {
        app: ["./src/main.ts"]
    },
    watch: true,
    devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "ifvisible.js",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [{
            test: /\.tsx?$/, loader: "ts-loader"
        }]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(version)
        })
    ]
};

if (process.env.PURPOSE === "production") {
    console.log("Production Mode");
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        output: {
            comments: false
        }
    }));
    config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
    config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());

    config.devtool = null;
    config.devServer = null;
    config.watch = false;
}

config.plugins.push(new WebpackShellPlugin({
    dev: false,
    onBuildEnd: ['cp ./dist/ifvisible.js ./docs/']
}));

module.exports = config;