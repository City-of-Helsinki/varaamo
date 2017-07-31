import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import FeedbackLink from 'shared/feedback-link';
import Logo from 'shared/logo';
import { injectT } from 'i18n';
import { getCurrentCustomization } from 'utils/customizationUtils';

function FooterContent({ onLinkClick, t }) {
  const feedbackLink = <FeedbackLink>{t('Footer.feedbackLink')}</FeedbackLink>;

  switch (getCurrentCustomization()) {
    case 'ESPOO': {
      return (
        <div>
          <Link className="brand-link" onClick={onLinkClick} to="/">
            <Logo />
            Varaamo
          </Link>
          <p>{t('Footer.espooText')} {feedbackLink}</p>
        </div>
      );
    }

    default: {
      return (
        <div>
          <Link className="brand-link" onClick={onLinkClick} to="/">
            <Logo />
            Varaamo
          </Link>
          <p>{t('Footer.helsinkiText')} {feedbackLink}</p>
        </div>
      );
    }
  }
}

FooterContent.propTypes = {
  onLinkClick: PropTypes.func,
  t: PropTypes.func.isRequired,
};

FooterContent.defaultProps = {
  onLinkClick: () => {},
};

export default injectT(FooterContent);
