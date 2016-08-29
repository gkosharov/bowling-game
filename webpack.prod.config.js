/**
 * Created by g.kosharov on 28.8.2016
 */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    entry: [
        path.normalize(path.join(__dirname, "./client/index"))
    ],
    output: {
        path: path.resolve(__dirname, "public"),
        filename: 'bundle.js',
        publicPath: '/public/'
    },
    plugins: [
        new ExtractTextPlugin("bundle.css"),
        new HtmlWebpackPlugin({
            title: 'Bowling Game',
            filename: 'index.html',
            template: 'index.tpl.ejs',
            bundleCss: 'bundle.css',
            bundleJs: 'bundle.js'
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "deploymentType": JSON.stringify(process.env.NODE_ENV || "production")
            }
        })
    ],

    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        },
            {
                test: /\.(jpg|jpeg|gif|png)$/,
                exclude: /node_modules/,
                loader:'url-loader?limit=1024&name=images/[name].[ext]'
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=1024&name=fonts/[name].[ext]'
            }]
    }

};