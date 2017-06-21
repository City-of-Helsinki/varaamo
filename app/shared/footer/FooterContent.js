import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import FeedbackLink from 'shared/feedback-link';
import Logo from 'shared/logo';
import { injectT } from 'i18n';
import { getCurrentCustomization } from 'utils/customizationUtils';

function FooterContent({ t }) {
  const aboutLink = (
    <Link className="about-link" to="/about">
      {t('Footer.aboutLink')}
    </Link>
  );

  const feedbackLink = <FeedbackLink>{t('Footer.feedbackLink')}</FeedbackLink>;

  switch (getCurrentCustomization()) {
    case 'ESPOO': {
      return (
        <div>
          <Link className="brand-link" to="/">
            <Logo />
            Varaamo
          </Link>
          <p>{t('Footer.espooText')} {feedbackLink}</p>
          {aboutLink}
        </div>
      );
    }

    default: {
      return (
        <div>
          <Link className="brand-link" to="/">
            <Logo />
            Varaamo
          </Link>
          <p>{t('Footer.helsinkiText')} {feedbackLink}</p>
          {aboutLink}
        </div>
      );
    }
  }
}

FooterContent.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(FooterContent);
