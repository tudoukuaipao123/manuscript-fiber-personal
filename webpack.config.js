import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  entry: "./src/index.js",
  mode:'development',
  output: {
    path:  path.resolve(__dirname, './dist/')
  },
  devtool: "eval-cheap-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ]
  },
  devServer:{
    hot: true,
    host: "localhost",
    port: "8081",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: true,
      path: "/dist/",
    }),
    new CleanWebpackPlugin(),
  ]
}