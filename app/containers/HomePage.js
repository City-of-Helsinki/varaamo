import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

import PurposeCategoryList from 'containers/PurposeCategoryList';

class HomePage extends Component {
  render() {
    return (
      <DocumentTitle title="Etusivu - Respa">
        <div>
          <h2>Mitä haluat tehdä?</h2>
          <PurposeCategoryList />
        </div>
      </DocumentTitle>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
