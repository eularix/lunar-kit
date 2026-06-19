const { getDefaultConfig } = require('expo/metro-config');
const { withLunarCSS } = require('@lunar-kit/css/metro');

const config = getDefaultConfig(__dirname);

module.exports = withLunarCSS(config);
