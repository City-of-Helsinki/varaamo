import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

import PurposeCategoryList from 'containers/PurposeCategoryList';

class HomePage extends Component {
  render() {
    return (
      <DocumentTitle title="Etusivu - Varaamo">
        <div>
          <h2>Varaa vaivatta kaupungin tiloja ja laitteita</h2>
          <p>
            Varaustilanteen näet kirjautumatta. Varaaminen edellyttää kirjautumista. Kyseessä on
            kokeiluasteella oleva palvelu, jonka kautta varataan Kaupunginkirjaston,
            Nuorisoasiainkeskuksen ja Varhaiskasvatusviraston tiloja ja työpisteitä.
          </p>
          <h2>Mitä haluat tehdä?</h2>
          <PurposeCategoryList />
        </div>
      </DocumentTitle>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
