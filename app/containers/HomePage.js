import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

class HomePage extends Component {
  render() {
    return (
      <DocumentTitle title="Etusivu - Respa">
        <div>
          <h1>Etusivu</h1>
        </div>
      </DocumentTitle>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
