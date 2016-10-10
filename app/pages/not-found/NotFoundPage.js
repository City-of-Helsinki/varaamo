import React from 'react';
import Well from 'react-bootstrap/lib/Well';
import { Link } from 'react-router';

import PageWrapper from 'pages/PageWrapper';
import { getSearchPageUrl } from 'utils/searchUtils';

function NotFoundPage() {
  return (
    <PageWrapper title="404 Sivua ei löydy">
      <div>
        <h1>404 Sivua ei löydy</h1>
        <p className="lead">
          <strong>Pahoittelut!</strong> Näyttää siltä, että tätä sivua ei ole olemassa.
        </p>
        <Well>
          <h5>Voit yrittää seuraavaa:</h5>
          <ul>
            <li>
              Jos etsit jotain tiettyä tilaa, voit etsiä
              sitä <Link to={getSearchPageUrl()}>hakusivulta</Link>.
            </li>
            <li>Jos syötit sivun osoitteen käsin, tarkista että se on oikein.</li>
            <li>
              Jos tulit tälle sivulle jostain toisesta sivustomme osasta,
              ota meihin yhteyttä, jotta voimme korjata virheen.
            </li>
          </ul>
        </Well>
      </div>
    </PageWrapper>
  );
}

NotFoundPage.propTypes = {};

export default NotFoundPage;
