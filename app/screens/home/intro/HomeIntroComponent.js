import React from 'react';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';

import ShowResourcesLink from './ShowResourcesLink';

function HomeIntroComponent() {
  return (
    <div className="home-intro">
      <div className="content">
        <Jumbotron>
          <h2>Tilat ja laitteet varattavana</h2>
          <p>Varaamosta voit varata julkisia tiloja ja laitteita omaan käyttöösi</p>
          <ShowResourcesLink />
        </Jumbotron>
      </div>
    </div>
  );
}

HomeIntroComponent.propTypes = {};

export default HomeIntroComponent;
