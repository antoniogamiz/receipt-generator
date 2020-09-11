const path = require("path");

module.exports = {
  resolve: {
    modules: ["src", "node_modules"],
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  devtool: "source-map",
  entry: "./public/electron.ts",
  target: "electron-main",
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
};
