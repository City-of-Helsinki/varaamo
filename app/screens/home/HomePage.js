import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

import PurposeCategoryList from 'containers/PurposeCategoryList';
import HomeIntroComponent from './intro/HomeIntroComponent';

class HomePage extends Component {
  render() {
    return (
      <DocumentTitle title="Etusivu - Varaamo">
        <div>
          <HomeIntroComponent />
          <h2 id="purpose-category-header">Mitä haluat tehdä?</h2>
          <PurposeCategoryList />
        </div>
      </DocumentTitle>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
