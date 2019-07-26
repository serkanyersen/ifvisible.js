const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const version = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"))).version;
const WebpackShellPlugin = require("webpack-shell-plugin");
const isProd = process.env.NODE_ENV === "production";

let config = {
    mode: 'development',
    entry: {
        app: ["./src/main.ts"]
    },
    watch: !isProd,
    devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "ifvisible.js",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: {
                loader: "ts-loader"
            }
        }]
    },
    optimization: {
        minimize: isProd
    },
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(version)
        })
    ]
};

if (isProd) {
    console.log("Production Mode");
    config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

config.plugins.push(new WebpackShellPlugin({
    dev: false,
    onBuildEnd: ['cp ./dist/ifvisible.js ./docs/']
}));

module.exports = config;
