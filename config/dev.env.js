/**
 * @file 开发版本设置
 *
 * @author vue-cli
 * @date 2018-05-15
 */

'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"'
});
