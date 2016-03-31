import hashFile from 'hash-file';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

const defaultPort = isProduction ? 8080 : 3000;
const port = process.env.PORT || defaultPort;

const defaultLoginCallbackUrl = (
  isProduction ?
  'https://varaamo.hel.fi/login/helsinki/return' :
  `http://localhost:${port}/login/helsinki/return`
);
const loginCallbackUrl = process.env.LOGIN_CALLBACK_URL || defaultLoginCallbackUrl;

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
  loginCallbackUrl,
  port,
  webpackStylesExtensions: ['css', 'less'],
};
