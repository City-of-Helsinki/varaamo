import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../app/i18n/injectT';
import FontSizes from '../../../app/constants/FontSizes';
import HeaderFontSizeButton from './HeaderFontSizeButton';

function getVariant(fontSize) {
  switch (fontSize) {
    case FontSizes.small:
      return 'small';
    case FontSizes.medium:
      return 'medium';
    case FontSizes.large:
      return 'large';
    default:
      return 'small';
  }
}

const HeaderFontSizeControl = ({ fontSize, setFontSize, t }) => {
  return (
    <div className="app-HeaderFontSizeControl">
      <span className="app-HeaderFontSizeControl__label">{t('HeaderFontSizeControl.label')}</span>
      <div className="app-HeaderFontSizeControl__option-list">
        {Object.values(FontSizes).map(fontSizeOption => (
          <HeaderFontSizeButton
            aria-label={t(`HeaderFontSizeControl.${fontSizeOption}`)}
            aria-pressed={fontSize === fontSizeOption}
            key={fontSizeOption}
            onClick={() => setFontSize(fontSizeOption)}
            variant={getVariant(fontSizeOption)}
          />
        ))}
      </div>
    </div>
  );
};

HeaderFontSizeControl.propTypes = {
  fontSize: PropTypes.oneOf(Object.values(FontSizes)),
  setFontSize: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(HeaderFontSizeControl);
