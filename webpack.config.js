/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");

const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "package.json"))
);

const isProd = process.env.NODE_ENV === "production";

const config = {
  mode: "development",
  entry: {
    ifvisible: ["./src/main.ts"],
    demo: ["./src/demo/demo.ts"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "umd",
  },
  devServer: {
    hot: false,
  },
  devtool: isProd ? false : "eval",
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/__tests__/, /node_modules/],
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  optimization: {
    minimize: isProd,
  },
  plugins: [
    new HtmlPlugin({
      template: "./src/demo/index.html",
      inject: "head",
    }),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(version),
    }),
    ...(isProd
      ? [
          new webpack.optimize.AggressiveMergingPlugin(),
          new webpack.SourceMapDevToolPlugin({
            append: "\n//# sourceMappingURL=[url]",
            filename: "[name].map",
          }),
        ]
      : []),
  ],
};

module.exports = config;
