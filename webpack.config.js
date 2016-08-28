/**
 * Created by g.kosharov on 28.8.2016
 */
import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from "extract-text-webpack-plugin"

export default {
    devtool: 'inline-source-map',
    entry: [
        path.normalize(path.join(__dirname, "./client/index"))
    ],
    output: {
        path: path.resolve(__dirname, "build"),
        filename: 'bundle.js',
        publicPath: '/public/'
    },
    plugins: [
        /*new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),*/
        new ExtractTextPlugin("bundle.css"),
        new webpack.DefinePlugin({
            "process.env": {
                "deploymentType": JSON.stringify(process.env.NODE_ENV || "development")
            }
        })
    ],
    /*resolveLoader: {
        root: path.join(__dirname, "..", "..", 'node_modules')
    },
    resolve: {
        root: [
            path.join(__dirname, "..", "..", "node_modules")
        ],
        extensions: ['', '.js']
    },*/
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
