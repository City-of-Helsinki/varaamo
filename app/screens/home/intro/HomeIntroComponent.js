import React from 'react';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';

function HomeIntroComponent() {
  return (
    <div className="home-intro-wrapper">
      <div className="home-intro-content">
        <Jumbotron>
          <h2>Tilat ja laitteet varattavana</h2>
          <p>Varaamosta voit varata julkisia tiloja ja laitteita omaan käyttöösi</p>
        </Jumbotron>
      </div>
    </div>
  );
}

HomeIntroComponent.propTypes = {};

export default HomeIntroComponent;
