import path from 'path';

import hashFile from 'hash-file';

const isProduction = process.env.NODE_ENV === 'production';

const defaultPort = isProduction ? 8080 : 3000;
const port = process.env.PORT || defaultPort;

function getAssetHash(filePath) {
  if (!isProduction) return '';
  try {
    return hashFile.sync(filePath);
  } catch (error) {
    return '';
  }
}

module.exports = {
  assetsSources: {
    appCss: (
      isProduction ?
      `/_assets/app.css?${getAssetHash(path.resolve(__dirname, '../dist/app.css'))}` :
      ''
    ),
    appJs: (
      isProduction ?
      `/_assets/app.js?${getAssetHash(path.resolve(__dirname, '../dist/app.js'))}` :
      '/app.js'
    ),
  },
  isProduction,
  piwikSiteId: process.env.PIWIK_SITE_ID,
  port,
  webpackStylesExtensions: ['css', 'scss'],
};
