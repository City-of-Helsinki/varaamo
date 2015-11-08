import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

class AboutPage extends Component {
  render() {
    return (
      <DocumentTitle title="Tietoa palvelusta - Respa">
        <div className="about-page">
          <h1>Tietoa Respa palvelusta</h1>
          <p className="lead">
            Lorem ipsum dolor sit amet, summo audire feugait ei per. At mel movet facilisis
            instructior. Qui ex hinc error probatus, nam eius repudiare reprimique et, cum an
            dolore necessitatibus. Ad eam fabellas percipitur, viderer incorrupte philosophia pri
            in.
          </p>
          <p>
            Te suscipit patrioque necessitatibus est, eam harum habemus ex, vocent vituperata te
            vix. Eam prompta perfecto similique id. At eos meis appareat, ad sed partem eirmod
            interpretaris. Eum at dicam persius, menandri facilisis sed ad.
          </p>
          <p>
            Minimum fabellas scripserit eum in, in postulant aliquando eam. Erat nulla appareat id
            sed. In verear nostrum nam, unum lobortis mel in. Mel ne quem omnes eruditi, nam
            apeirian sententiae delicatissimi ex, usu et corpora accumsan tractatos. Mea timeam
            delicatissimi ne. Dolor essent id has, vix sumo volumus principes ei.
          </p>
        </div>
      </DocumentTitle>
    );
  }
}

AboutPage.propTypes = {};

export default AboutPage;
