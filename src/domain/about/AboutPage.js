import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import AboutPartners from './AboutPartners';
import PageWrapper from '../../../app/pages/PageWrapper';
import FeedbackLink from '../../../app/shared/feedback-link/FeedbackLink';
import injectT from '../../../app/i18n/injectT';
import { getCurrentCustomization } from '../../../app/utils/customizationUtils';

function AboutPage({ t }) {
  const city = getCurrentCustomization() ? getCurrentCustomization().toLowerCase() : 'default';
  // TODO: Remove me along with getCurrentCustomization stuff.

  return (
    <PageWrapper className="about-page" title={t('AboutPage.title')}>
      <div className="app-aboutPage">
        <h1>{t(`AboutPageContent.${city}Header`)}</h1>
        <p className="app-aboutPage__lead">{t(`AboutPageContent.${city}Lead`)}</p>

        <p>{t('AboutPageContent.pilotParagraph')}</p>
        <p>{t(`AboutPageContent.${city}ReservableParagraph`)}</p>
        <p><FormattedHTMLMessage id="AboutPageContent.basedOnParagraph" /></p>
        <p>{t('AboutPageContent.developmentParagraph')}</p>
        <p>{t('AboutPageContent.goalParagraph')}</p>
        <p>
          {t('AboutPageContent.feedbackParagraph')}
          <FeedbackLink>{t('AboutPageContent.feedbackLink')}</FeedbackLink>
        </p>

        {city !== 'default' && (
        <div>
          <h3>{t(`AboutPageContent.${city}PartnersHeader`)}</h3>
          <AboutPartners />
        </div>
        )}

        <h3>{t('AboutPageContent.customerRegisterHeader')}</h3>
        <p>
          {t('AboutPageContent.customerRegisterParagraph')}
          <a href="https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Kuva/Tilanvaraus-%20ja%20tietokantarekisteri,%20Varaamo%20ja%20Respa.pdf">
            {t('AboutPageContent.customerRegisterLink')}
          </a>
        </p>
        <br />
      </div>
    </PageWrapper>
  );
}

AboutPage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(AboutPage);
