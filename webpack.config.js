const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    main: path.resolve(__dirname, "skins/weewx-wdc/src/js/index.tsx"),
    "service-worker": path.resolve(
      __dirname,
      "skins/weewx-wdc/src/js/service-worker.ts"
    ),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sassOptions: {
                quietDeps: true,
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: devMode ? "source-map" : false,
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "skins/weewx-wdc/dist"),
    globalObject: "this",
  },
  plugins: [new MiniCssExtractPlugin()],
};
