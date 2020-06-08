import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const VARIANTS = ['small', 'medium', 'large'];

const mainStyle = 'app-HeaderFontSizeButton';
const styles = {
  main: mainStyle,
  small: `${mainStyle}--small`,
  medium: `${mainStyle}--medium`,
  large: `${mainStyle}--large`,
};

const HeaderFontSizeButton = ({ variant, ...rest }) => {
  return (
    <button
      {...rest}
      className={classNames(styles.main, {
        [styles.small]: variant === VARIANTS[0],
        [styles.medium]: variant === VARIANTS[1],
        [styles.large]: variant === VARIANTS[2],
      })}
      type="button"
    >
      A
    </button>
  );
};

HeaderFontSizeButton.propTypes = {
  'aria-label': PropTypes.string.isRequired,
  'aria-pressed': PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(VARIANTS).isRequired,
};

export default HeaderFontSizeButton;
