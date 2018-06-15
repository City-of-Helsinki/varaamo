import React, { PropTypes } from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import FeedbackLink from 'shared/feedback-link';
import { injectT } from 'i18n';
import { getCurrentCustomization } from 'utils/customizationUtils';
import AboutPartners from './AboutPartners';

const defaultTranslationKeys = {
  header: 'AboutPageContent.defaultHeader',
  lead: 'AboutPageContent.defaultLead',
  reservable: 'AboutPageContent.defaultReservableParagraph',
};

const customizedTranslationKeys = {
  ESPOO: {
    header: 'AboutPageContent.espooHeader',
    lead: 'AboutPageContent.espooLead',
    reservable: 'AboutPageContent.espooReservableParagraph',
    partners: 'AboutPageContent.espooPartnersHeader',
  },
  VANTAA: {
    header: 'AboutPageContent.vantaaHeader',
    lead: 'AboutPageContent.vantaaLead',
    reservable: 'AboutPageContent.vantaaReservableParagraph',
    partners: 'AboutPageContent.vantaaPartnersHeader',
  },
};

function AboutPageContent({ t }) {
  const customization = getCurrentCustomization();
  let translationKeys = defaultTranslationKeys;
  if (customization) {
    translationKeys = customizedTranslationKeys[customization];
  }

  return (
    <div>
      <h1>{t(translationKeys.header)}</h1>
      <p className="lead">{t(translationKeys.lead)}</p>
      <p>{t('AboutPageContent.pilotParagraph')}</p>
      <p>{t(translationKeys.reservable)}</p>
      <p><FormattedHTMLMessage id="AboutPageContent.basedOnParagraph" /></p>
      <p>{t('AboutPageContent.developmentParagraph')}</p>
      <p>{t('AboutPageContent.goalParagraph')}</p>
      <p>
        {t('AboutPageContent.feedbackParagraph')}
        {' '}
        <FeedbackLink>{t('AboutPageContent.feedbackLink')}</FeedbackLink>
      </p>
      {translationKeys.partners && (
        <div>
          <h3>{t(translationKeys.partners)}</h3>
          <AboutPartners />
        </div>
      )}

      <h3>{t('AboutPageContent.customerRegisterHeader')}</h3>
      <p>
        {t('AboutPageContent.customerRegisterParagraph')}
        {' '}
        <a href="https://app.helmet-kirjasto.fi/varaamo/rekisteriseloste.php">
          {t('AboutPageContent.customerRegisterLink')}
        </a>
      </p>
      <br />
    </div>
  );
}

AboutPageContent.propTypes = {
  t: PropTypes.func.isRequired,
};


export default injectT(AboutPageContent);
