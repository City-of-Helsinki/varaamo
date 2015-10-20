import Radium from 'radium';
import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

import styles from './Footer.styles';
import logoSrc from 'assets/images/helsinki-coat-of-arms-white.png';

export class Footer extends Component {
  render() {
    const RadiumLink = Radium(Link);

    return (
      <footer style={styles.footer}>
        <Grid>
          <Row>
            <Col lg={3} md={3}>
              <RadiumLink style={styles.brandLink} to="/">
                <img
                  alt="Helsingin vaakuna"
                  src={logoSrc}
                  style={styles.logo}
                />
                Respa
              </RadiumLink>
            </Col>
            <Col lg={5} md={5}>
              <p>Tämä on palvelun ensimmäinen pilottiversio, josta toivomme käyttäjiltä palautetta.</p>
              <p>Palautetta voit lähettää sähköpostilla osoitteeseen <a href="mailto:esimerkki@hel.fi" style={styles.link}>esimerkki@hel.fi</a>.</p>
            </Col>
            <Col lg={3} lgOffset={1} md={3} mdOffset={1}>
              <p>Pilotissa mukana</p>
              <ul>
                <li>Kirjasto 10</li>
                <li>Kaupunkiverstas</li>
              </ul>
            </Col>
          </Row>
        </Grid>
      </footer>
    );
  }
}

Footer.propTypes = {};

export default Radium(Footer);
