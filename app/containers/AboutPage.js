import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

class AboutPage extends Component {
  render() {
    const refUrl = window.location.href;

    return (
      <DocumentTitle title="Tietoa palvelusta - Varaamo">
        <div className="about-page">
          <h1>Tietoa varaamo.hel.fi –palvelusta</h1>
          <p className="lead">
            Varaamo on on Helsingin kaupungin ylläpitämä verkkopalvelu, jonka kautta voi varata
            kaupungin julkisia tiloja sekä työpisteitä yksityiseen käyttöön.
          </p>
          <p>
            Tilavarausjärjestelmä on testausvaiheessa, eikä pilottikäytössä olevassa versiossa
            ole vielä kaikkia suunnitteilla olevia ominaisuuksia ja toiminnallisuuksia.
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
            Varaamo-tilavarausjärjestelmän kehittäminen on osa Helsingin kaupungin strategiaohjelmaa
            2013 - 2016 (Tehokkaat ja toimivat tukipalvelut) sekä tietotekniikkaohjelmaa 2015 - 2017
            (Datarajapinnat ja avoin kaupunkikehitys).
          </p>
          <p>
            Virastoyhteisen tilavaraushankkeen tavoitteena on julkisten tilojen käytön tehostaminen,
            saavutettavuuden parantaminen ja tilojen käyttöön liittyvien kustannusten alentaminen
            kaupungin tilavarauskäytäntöjä yhtenäistämällä.
          </p>
          <p>
            Palvelua kehitetään edelleen ja toivomme palvelun käyttäjiltä palautetta. Palautetta
            voit antaa <a
              href={`http://www.helmet-kirjasto.fi/respa-palaute/?url=${refUrl}`}
            >tämän linkin</a> kautta.
          </p>
        </div>
      </DocumentTitle>
    );
  }
}

AboutPage.propTypes = {};

export default AboutPage;
