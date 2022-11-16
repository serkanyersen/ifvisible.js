/* eslint-disable @typescript-eslint/no-var-requires */

import * as path from "path";
import * as fs from "fs";
import * as webpack from "webpack";
import * as HtmlPlugin from "html-webpack-plugin";
import {
  defineEnv,
  validateEnv,
  WebpackCliEnv,
} from "./src/utils/WebpackCliEnvDefine";
const SimpleProgressWebpackPlugin = require("simple-progress-webpack-plugin");

const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "package.json")).toString()
);

interface EnvArgs {
  report: boolean;
  help: boolean;
  tries: number;
  test: {
    name: string;
    type: string;
    bad: {
      lol: number;
    };
  };
}

defineEnv({
  report: {
    description: "Generate a bundle report",
    required: true,
    type: "boolean",
  },
  help: {
    description: "Generate a bundle report",
    type: "boolean",
  },
  tries: {
    description: "Try N times",
    type: "number",
  },
  test: {
    description: "test an object type",
    required: ["name", "bad.lol"],
    type: {
      name: "string",
      type: "string",
      bad: {
        lol: "number",
      },
    },
  },
});

module.exports = (
  env: WebpackCliEnv,
  options: webpack.WebpackOptionsNormalized
) => {
  const parsed = validateEnv<EnvArgs>(env);
  const isProd = options.mode === "production";

  console.log(parsed);

  return {
    mode: "development",
    entry: {
      ifvisible: ["./src/main.ts"],
      demo: ["./src/demo/demo.ts"],
    },
    stats: false,
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      libraryTarget: "umd",
    },
    devServer: {
      hot: false,
    },
    devtool: isProd ? false : "cheap-source-map",
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
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
      new SimpleProgressWebpackPlugin({
        format: "minimal",
      }),
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
  } as webpack.Configuration;
};
