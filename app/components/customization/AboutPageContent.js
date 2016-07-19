import React, { Component } from 'react';

import { FEEDBACK_URL } from 'constants/AppConstants';
import { getCurrentCustomization } from 'utils/CustomizationUtils';

class AboutPageContent extends Component {
  render() {
    switch (getCurrentCustomization()) {

    case 'ESPOO':
      return (
        <span>
          <p>Placeholder text for Espoo about page.</p>
        </span>
      );

    default:
      const refUrl = window.location.href;
      const feedbackLink = (
        <a href={`${FEEDBACK_URL}?ref=${refUrl}`}>
          tämän linkin
        </a>
      );
      const registerLink = (
        <a href="http://www.helmet-kirjasto.fi/varaamo-palaute/rekisteriseloste.php">
          Asiakasrekisteriseloste
        </a>
      );

      return (
        <span>
          <h1>Tietoa varaamo.hel.fi –palvelusta</h1>
          <p className="lead">
            Varaamo on Helsingin kaupungin ylläpitämä verkkopalvelu, jonka kautta voi varata
            kaupungin julkisia tiloja sekä työpisteitä yksityiseen käyttöön.
          </p>
          <p>
            Tilavarausjärjestelmä on testausvaiheessa, eikä pilottikäytössä olevassa versiossa ole
            vielä kaikkia suunnitteilla olevia ominaisuuksia ja toiminnallisuuksia.
          </p>
          <p>
            Pilottivaiheessa palvelun kautta on varattavissa kaupunginkirjaston,
            nuorisoasiainkeskuksen sekä varhaiskasvatusviraston tiloja, työpisteitä ja laitteita.
          </p>
          <p>
            Osa palvelun kautta tarjottavista tiloista on maksullisia. Maksullisten tilojen
            varaaminen ei kuitenkaan ole vielä pilotin ensimmäisessä vaiheessa mahdollista.
            Maksulliset tilat näkyvät varauskalenterissa ja niiden yhteydessä on tarvittavat
            yhteystiedot tilavarauksen tekemiseen sähköpostilla tai puhelimitse.
          </p>
          <p>
            Varaamo perustuu Helsingin kaupungin avoimeen <a href="http://dev.hel.fi/apis/respa">
            tilavarausrajapintaan</a>, joka on toteutettu osana Suomen suurimpien kaupunkien
            yhteistä <a href="http://6aika.fi">6aika - Avoimet ja älykkäät palvelut</a> -hanketta.
          </p>
          <p>
            Varaamo-tilavarausjärjestelmän kehittäminen on osa Helsingin kaupungin
            strategiaohjelmaa 2013 - 2016 (Tehokkaat ja toimivat tukipalvelut) sekä
            tietotekniikkaohjelmaa 2015 - 2017 (Datarajapinnat ja avoin kaupunkikehitys).
          </p>
          <p>
            Virastoyhteisen tilavaraushankkeen tavoitteena on julkisten tilojen käytön tehostaminen,
            saavutettavuuden parantaminen ja tilojen käyttöön liittyvien kustannusten alentaminen
            kaupungin tilavarauskäytäntöjä yhtenäistämällä.
          </p>
          <p>
            Palvelua kehitetään edelleen ja toivomme palvelun käyttäjiltä palautetta. Palautetta
            voit antaa {feedbackLink} kautta.
          </p>
          <h3>Asiakasrekisteriseloste</h3>
          <p>
            Palveluun liittyvän asiakasreskisteriselosteen näet täältä: {registerLink}
          </p>
        </span>
      );
    }
  }
}

AboutPageContent.propTypes = {};

export default AboutPageContent;
