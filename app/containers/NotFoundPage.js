import React, { Component } from 'react';
import { Well } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';

class NotFoundPage extends Component {
  render() {
    return (
      <DocumentTitle title="404 Sivua ei löydy - Varaamo">
        <div>
          <h1>404 Sivua ei löydy</h1>
          <p className="lead">
            <strong>Pahoittelut!</strong> Näyttää siltä, että tätä sivua ei ole olemassa.
          </p>
          <Well>
            <h5>Voit yrittää seuraavaa:</h5>
            <ul>
              <li>Jos etsit jotain tiettyä tilaa, voit etsiä sitä <Link to="/search">hakusivulta</Link>.</li>
              <li>Jos syötit sivun osoitteen käsin, tarkista että se on oikein.</li>
              <li>Jos tulit tälle sivulle jostain toisesta sivustomme osasta, ota meihin yhteyttä, jotta voimme korjata virheen.</li>
            </ul>
          </Well>
        </div>
      </DocumentTitle>
    );
  }
}

NotFoundPage.propTypes = {};

export default NotFoundPage;
