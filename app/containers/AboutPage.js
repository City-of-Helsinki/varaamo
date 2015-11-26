import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

class AboutPage extends Component {
  render() {
    return (
      <DocumentTitle title="Tietoa palvelusta - Varaamo">
        <div className="about-page">
          <h1>Tietoa respa.hel.fi –palvelusta</h1>
          <p className="lead">
            Varaamo on Helsingin kaupungin ylläpitämä verkkopalvelu, jonka kautta voidaan varata
            kaupungin julkisia tiloja sekä työpisteitä yksityiseen käyttöön.
          </p>
          <p>
            Palvelu on testausvaiheessa, ja sen pilottikäytössä olevassa versiossa ei ole vielä
            kaikkia suunnitteilla olevia ominaisuuksia ja toiminnallisuuksia. Testiversion
            tarkoituksena on kaupungin sisäisten tilavarauskäytäntöjen yhtenäistämisen ohella
            saada palautetta myös itse palvelusta ja sen toiminnasta. <strong>Palautetta voi antaa
            joka sivulla sijaitsevan palautelaatikon kautta. ?</strong>
          </p>
          <p>
            Pilottivaiheessa palvelun kautta on varattavissa kaupunginkirjaston,
            nuorisoasiainkeskuksen sekä varhaiskasvatusviraston tiloja ja työpisteitä. Osa palvelun
            kautta tarjottavista tiloista on maksullisia ja niiden varaaminen suoraan
            tilavarausjärjestelmän kautta ei ole alkuvaiheessa mahdollista, vaan maksullisista
            tiloista nähtävissä ovat varauskalenteri sekä tarvittavat yhteystiedot tilavarauksen
            tekemiseen.
          </p>
          <p>
            Varaamo-tilavarausjärjestelmän kehittäminen toimii osana Helsingin kaupungin
            strategiaohjelman 2013 - 2016 (Tehokkaat ja toimivat tukipalvelut) sekä
            tietotekniikkaohjelman 2015 - 2017 (Datarajapinnat ja avoin kaupunkikehitys)
            jalkauttamista. Virastoyhteisen tilavarauskokeilun tavoitteena on julkisten tilojen
            käytön tehostaminen, saavutettavuuden parantaminen ja tilojen käyttöön liittyvien
            kustannusten alentaminen.
          </p>
        </div>
      </DocumentTitle>
    );
  }
}

AboutPage.propTypes = {};

export default AboutPage;
