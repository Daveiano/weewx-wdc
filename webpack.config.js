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
    "live-updates": path.resolve(
      __dirname,
      "skins/weewx-wdc/src/js/live-updates.ts"
    ),
    "colored-temperature": path.resolve(
      __dirname,
      "skins/weewx-wdc/src/js/colored-temperature.ts"
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
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: devMode ? "source-map" : false,
  output: {
    filename: "[name].js",
    assetModuleFilename: "assets/[name][ext]",
    path: path.resolve(__dirname, "skins/weewx-wdc/dist"),
    globalObject: "this",
    clean: true,
  },
  plugins: [new MiniCssExtractPlugin()],
};
