import hashFile from 'hash-file';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

function getAssetHash(filePath) {
  if (!isProduction) return '';
  try {
    return hashFile.sync(filePath);
  } catch (error) {
    return '';
  }
}

export default {
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
  isProduction: isProduction,
  port: isProduction ? 8080 : 3000,
  webpackStylesExtensions: ['css', 'less'],
};
