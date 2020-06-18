import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { changeFontSize } from '../../../app/actions/uiActions';
import injectT from '../../../app/i18n/injectT';
import FontSizes from '../../../app/constants/FontSizes';
import HeaderOption from './HeaderOption';
import HeaderFontSizeButton from './HeaderFontSizeButton';

function getVariant(fontSize) {
  switch (fontSize) {
    case FontSizes.SMALL:
      return 'small';
    case FontSizes.MEDIUM:
      return 'medium';
    case FontSizes.LARGE:
      return 'large';
    default:
      return 'small';
  }
}

const HeaderFontSizeControl = ({ fontSize, setFontSize, t }) => {
  return (
    <HeaderOption
      label={t('HeaderFontSizeControl.label')}
    >
      {Object.values(FontSizes).map(fontSizeOption => (
        <HeaderFontSizeButton
          aria-label={t(`HeaderFontSizeControl.${fontSizeOption}`)}
          aria-pressed={fontSize === fontSizeOption}
          key={fontSizeOption}
          onClick={() => setFontSize(fontSizeOption)}
          variant={getVariant(fontSizeOption)}
        />
      ))}
    </HeaderOption>
  );
};

HeaderFontSizeControl.propTypes = {
  fontSize: PropTypes.oneOf(Object.values(FontSizes)),
  setFontSize: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const fontSizeSelector = state => state.ui.accessibility.fontSize;

export const selector = createStructuredSelector({
  fontSize: fontSizeSelector,
});

const actions = {
  setFontSize: changeFontSize,
};

export default injectT(connect(selector, actions)(HeaderFontSizeControl));
