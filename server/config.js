import hashFile from 'hash-file';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? 8080 : 3000;

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
  loginCallbackUrl: (
    isProduction ?
    'https://varaamo.hel.fi/login/helsinki/return' :
    `http://localhost:${port}/login/helsinki/return`
  ),
  port,
  webpackStylesExtensions: ['css', 'less'],
};
