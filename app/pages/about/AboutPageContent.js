import React, { PropTypes } from 'react';

import FeedbackLink from 'shared/feedback-link';
import { injectT } from 'i18n';

function AboutPageContent({ t }) {
  return (
    <div>
      <h1>
        {t('AboutPageContent.defaultHeader')}
      </h1>
      <p>{t('AboutPageContent.developmentParagraph')}</p>
      <p>
        {t('AboutPageContent.defaultReservableParagraph')}
      </p>
      <p>
        {t('AboutPageContent.feedbackParagraph')}
        {' '}
      </p>
      <p>
        <FeedbackLink>{t('AboutPageContent.feedbackLink')}</FeedbackLink>
      </p>

      <h3>{t('AboutPageContent.customerRegisterHeader')}</h3>
      <p>
        {t('AboutPageContent.customerRegisterParagraph')}
        {' '}
        <a href="http://www.helmet-kirjasto.fi/varaamo-palaute/rekisteriseloste.php">
          {t('AboutPageContent.customerRegisterLink')}
        </a>
      </p>
    </div>
  );
}

AboutPageContent.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(AboutPageContent);
