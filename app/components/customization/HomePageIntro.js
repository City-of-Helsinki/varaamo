import React, { Component } from 'react';

import { getCurrentCustomization } from 'utils/CustomizationUtils';

class HomePageIntro extends Component {
  render() {
    switch (getCurrentCustomization()) {

      case 'ESPOO': {
        return (
          <div>
            <h2>Varaa vaivatta kaupungin tiloja ja laitteita</h2>
            <p>
              Varaustilanteen näet kirjautumatta. Varaaminen edellyttää kirjautumista.
              Kyseessä on kokeiluasteella oleva palvelu, jonka kautta varataan Espoon
              kaupunginkirjaston sekä Helsingin kaupungin tarjoamia tiloja ja työpisteitä.
            </p>
          </div>
        );
      }

      default: {
        return (
          <div>
            <h2>Varaa vaivatta kaupungin tiloja ja laitteita</h2>
            <p>
              Varaustilanteen näet kirjautumatta. Varaaminen edellyttää kirjautumista. Kyseessä on
              kokeiluasteella oleva palvelu, jonka kautta varataan kaupunginkirjaston,
              nuorisoasiainkeskuksen ja varhaiskasvatusviraston tiloja ja työpisteitä.
            </p>
          </div>
        );
      }
    }
  }
}

HomePageIntro.propTypes = {};

export default HomePageIntro;
