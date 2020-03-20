const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

// Support CSS modules because `hds-react` requires CSS modules for
// styles to work.
function getCssLoader(isProduction) {
  const styleLoader = !isProduction
    ? 'style-loader'
    : MiniCssExtractPlugin.loader;
  const styleConfig = { styleLoader };

  return [
    {
      test: /\.css$/,
      exclude: /\.module\.css$/,
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
    {
      test: /\.css$/,
      include: /\.module\.css$/,
      use: [
        styleConfig.styleLoader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: true,
          },
        },
      ],
    },
  ];
}

module.exports = getCssLoader;
