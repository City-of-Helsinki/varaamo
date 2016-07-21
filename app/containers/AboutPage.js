import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

import AboutPageContent from 'components/customization/AboutPageContent';

class AboutPage extends Component {
  render() {
    return (
      <DocumentTitle title="Tietoa palvelusta - Varaamo">
        <div className="about-page">
          <AboutPageContent />
        </div>
      </DocumentTitle>
    );
  }
}

AboutPage.propTypes = {};

export default AboutPage;
