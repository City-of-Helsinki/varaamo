import PropTypes from 'prop-types';
import React from 'react';

import injectT from '../../i18n/injectT';

function AccessibilityShortcuts({ t, mainContentId }) {
  const mainContentHref = `#${mainContentId}`;

  return (
    <div className="app-AccessibilityShortcuts">
      <a
        className="sr-only app-AccessibilityShortcuts__skip-link"
        href={mainContentHref}
      >
        {t('AccessibilityShortcuts.skipToContent')}
      </a>
    </div>
  );
}

AccessibilityShortcuts.propTypes = {
  t: PropTypes.func.isRequired,
  mainContentId: PropTypes.string.isRequired,
};

export default injectT(AccessibilityShortcuts);
