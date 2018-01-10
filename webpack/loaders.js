'use strict';

exports.tslint = {
    test: /\.tsx?$/,
    loader: 'tslint',
    exclude: /node_modules/,
};

exports.ts = {
    test: /\.tsx?$/,
    loader: 'awesome-typescript-loader',
    exclude: /node_modules/,
};

exports.istanbulInstrumenter = {
    test: /^(.(?!\.test))*\.tsx?$/,
    loader: 'istanbul-instrumenter-loader',
    query: {
        embedSource: true,
    },
};

exports.html = {
    test: /\.html$/,
    loader: 'raw',
    exclude: /node_modules/,
};

exports.css = {
    test: /\.scss$/,
    loader: 'style!css!sass?outputStyle=expanded',
    exclude: /node_modules/,
};

exports.json = {
    test: /\.json$/,
    loader: 'json',
};

exports.svgIcon = {
    test: /.*symbol-defs\.svg$/,
    loader: 'svg-sprite-loader'
};

exports.svg = makeUrlLoader(/\.svg$/);
exports.eot = makeUrlLoader(/\.eot$/);
exports.woff = makeUrlLoader(/\.woff$/);
exports.woff2 = makeUrlLoader(/\.woff2$/);
exports.ttf = makeUrlLoader(/\.ttf$/);

function makeUrlLoader(pattern) {
    return {
        test: pattern,
        loader: 'url',
        exclude: /(node_modules|.*symbol-defs\.svg$)/,
    };
}