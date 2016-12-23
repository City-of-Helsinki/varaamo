import React, { PropTypes } from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import FeedbackLink from 'shared/feedback-link';
import { injectT } from 'i18n';
import { getCurrentCustomization } from 'utils/customizationUtils';
import EspooPartners from './EspooPartners';

function AboutPageContent({ t }) {
  const isEspooDomain = getCurrentCustomization() === 'ESPOO';

  return (
    <div>
      <h1>
        {isEspooDomain ?
          t('AboutPageContent.espooHeader') :
          t('AboutPageContent.defaultHeader')
        }
      </h1>
      <p className="lead">
        {isEspooDomain ?
          t('AboutPageContent.espooLead') :
          t('AboutPageContent.defaultLead')
        }
      </p>
      <p>{t('AboutPageContent.pilotParagraph')}</p>
      <p>
        {isEspooDomain ?
          t('AboutPageContent.espooReservableParagraph') :
          t('AboutPageContent.defaultReservableParagraph')
        }
      </p>
      <p><FormattedHTMLMessage id="AboutPageContent.basedOnParagraph" /></p>
      <p>{t('AboutPageContent.developmentParagraph')}</p>
      <p>{t('AboutPageContent.goalParagraph')}</p>
      <p>
        {t('AboutPageContent.feedbackParagraph')}
        {' '}
        <FeedbackLink>{t('AboutPageContent.feedbackLink')}</FeedbackLink>
      </p>
      {isEspooDomain && (
        <div>
          <h3>{t('AboutPageContent.espooPartnersHeader')}</h3>
          <EspooPartners />
        </div>
      )}

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
