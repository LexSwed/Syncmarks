const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        popup: "./src/popup/index.js",
        background: "./src/background/index.js"
    },
    output: {
        filename: "[name]/[name].js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{ loader: "css-loader" }, "postcss-loader"]
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["env"],
                        plugins: [
                            require("babel-plugin-transform-runtime"),
                            require("babel-plugin-transform-object-rest-spread"),
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Syncmarks",
            filename: "popup/popup.html",
            template: "src/popup/popup.html",
            inject: false
        }),
        new ExtractTextPlugin("popup/[name].css")
    ]
};
