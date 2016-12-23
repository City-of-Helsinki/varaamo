import React, { PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';

import { injectT } from 'i18n';
import HomeIntro from './intro';
import Partners from './partners';
import PurposeList from './purpose-list';

function HomePage({ t }) {
  return (
    <DocumentTitle title="Varaamo">
      <div className="home-page">
        <HomeIntro />
        <Grid>
          <h3 id="purpose-category-header">{t('Home.purposeHeader')}</h3>
          <PurposeList />
          <Partners />
        </Grid>
      </div>
    </DocumentTitle>
  );
}

HomePage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(HomePage);
