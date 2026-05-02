const path = require('path');

process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, 'src/app');

const baseConfig = require('./app.json');

module.exports = () => ({
  ...baseConfig.expo,
});
