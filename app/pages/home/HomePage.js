import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';

import HomeIntroComponent from './intro/HomeIntroComponent';
import PartnersComponent from './partners/PartnersComponent';
import PurposeListContainer from './purpose-list/PurposeListContainer';

function HomePage() {
  return (
    <DocumentTitle title="Etusivu - Varaamo">
      <div className="home-page">
        <HomeIntroComponent />
        <Grid>
          <h3 id="purpose-category-header">Mitä haluat tehdä?</h3>
          <PurposeListContainer />
          <PartnersComponent />
        </Grid>
      </div>
    </DocumentTitle>
  );
}

HomePage.propTypes = {};

export default HomePage;
