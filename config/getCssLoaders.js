const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

function getCssLoader(isProduction) {
  const styleLoader = !isProduction
    ? 'style-loader'
    : MiniCssExtractPlugin.loader;
  const styleConfig = { styleLoader };

  return [
    {
      test: /\.css$/,
      use: [
        styleConfig.styleLoader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer({
                browsers: ['last 2 version', 'ie 9'],
              }),
            ],
          },
        },
      ],
    },
  ];
}

module.exports = getCssLoader;
