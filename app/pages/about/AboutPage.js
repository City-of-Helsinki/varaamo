import PropTypes from 'prop-types';
import React from 'react';

import PageWrapper from '../PageWrapper';
import injectT from '../../i18n/injectT';
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
