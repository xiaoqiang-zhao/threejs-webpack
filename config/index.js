/**
 * @file 基本配置
 *
 * @author liubin29
 * 2017年8月31日
 */

'use strict';
const path = require('path');
const mockMiddleware = require('../build/mock-middleware');

module.exports = {
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',

        host: '127.0.0.1',
        port: 8089,
        // autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false,
        cacheBusting: true,
        cssSourceMap: true,
        after(app) {
            app.use(mockMiddleware);
        }
    },

    build: {
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: false,
        devtool: '#source-map',
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    }
};
