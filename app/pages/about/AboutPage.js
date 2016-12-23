import React, { PropTypes } from 'react';

import PageWrapper from 'pages/PageWrapper';
import { injectT } from 'i18n';
import AboutPageContent from './AboutPageContent';

function AboutPage({ t }) {
  return (
    <PageWrapper className="about-page" title={t('AboutPage.title')}>
      <AboutPageContent />
    </PageWrapper>
  );
}

AboutPage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(AboutPage);
