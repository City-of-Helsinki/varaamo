import React from 'react';

import PageWrapper from 'pages/layout/PageWrapper';
import AboutPageContent from './AboutPageContent';

function AboutPage() {
  return (
    <PageWrapper className="about-page" title="Tietoa palvelusta">
      <AboutPageContent />
    </PageWrapper>
  );
}

AboutPage.propTypes = {};

export default AboutPage;
