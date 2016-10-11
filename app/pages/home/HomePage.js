import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';

import HomeIntro from './intro';
import Partners from './partners';
import PurposeListContainer from './purpose-list';

function HomePage() {
  return (
    <DocumentTitle title="Etusivu - Varaamo">
      <div className="home-page">
        <HomeIntro />
        <Grid>
          <h3 id="purpose-category-header">Mitä haluat tehdä?</h3>
          <PurposeListContainer />
          <Partners />
        </Grid>
      </div>
    </DocumentTitle>
  );
}

HomePage.propTypes = {};

export default HomePage;
