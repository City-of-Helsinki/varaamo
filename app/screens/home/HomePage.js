import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

import HomePageIntro from 'components/customization/HomePageIntro';
import PurposeCategoryList from 'containers/PurposeCategoryList';

class HomePage extends Component {
  render() {
    return (
      <DocumentTitle title="Etusivu - Varaamo">
        <div>
          <HomePageIntro />
          <h2 id="purpose-category-header">Mitä haluat tehdä?</h2>
          <PurposeCategoryList />
        </div>
      </DocumentTitle>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
