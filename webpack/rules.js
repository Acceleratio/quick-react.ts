'use strict';
const path = require('path');

exports.tslint = {
    test: /\.tsx?$/,
    enforce: "pre",
    loader: 'tslint-loader',
    include: [
        path.resolve(__dirname, "../src"),
        path.resolve(__dirname, "../examples")
    ]
};

exports.ts = {
    test: /\.tsx?$/,
    use: {
        loader: 'awesome-typescript-loader'
    },
    include: [
        path.resolve(__dirname, "../src"),
        path.resolve(__dirname, "../examples")
    ]
};

exports.html = {
    test: /\.html$/,
    loader: {
        loader: 'raw-loader'
    },
    include: [
        path.resolve(__dirname, "../src"),
        path.resolve(__dirname, "../examples")
    ]
};

exports.css = {
    test: /\.scss$/,
    use: [
        {
            loader: "style-loader"
        },
        {
            loader: "css-loader",
        },
        {
            loader: "sass-loader",
            options: {
                outputStyle: "expanded"
            }
        }
    ]
};

exports.svg = makeUrlRule(/\.svg$/);
exports.eot = makeUrlRule(/\.eot$/);
exports.woff = makeUrlRule(/\.woff$/);
exports.woff2 = makeUrlRule(/\.woff2$/);
exports.ttf = makeUrlRule(/\.ttf$/);
exports.png = makeUrlRule(/\.(png|jpg)$/);
exports.svgIcon = {
    test: /.*symbol-defs\.svg$/,
    loaders: [
        'svg-sprite-loader',
        {
            loader: 'svgo-loader',
            options: {
                enforce: 'pre',
                plugins: [
                    { removeTitle: true },
                ]
            }
        }
    ]
};

function makeUrlRule(pattern) {
    return {
        test: pattern,
        use: {
            loader: 'url-loader'
        },
        exclude: /(node_modules\/(?!@syskit)|.*symbol-defs\.svg$)/
    };
}
