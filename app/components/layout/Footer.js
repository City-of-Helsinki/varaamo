import Radium from 'radium';
import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

import styles from './Footer.styles';
import logoSrc from 'assets/images/helsinki-coat-of-arms-white.png';

class Footer extends Component {
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
                Varaamo
              </RadiumLink>
            </Col>
            <Col lg={6} md={6}>
              <p>Tämä on palvelun ensimmäinen pilottiversio, josta toivomme käyttäjiltä palautetta.</p>
              <p>Palautetta voit lähettää sähköpostilla osoitteeseen <a href="mailto:esimerkki@hel.fi" style={styles.link}>esimerkki@hel.fi</a>.</p>
            </Col>
          </Row>
        </Grid>
      </footer>
    );
  }
}

Footer.propTypes = {};

export default Radium(Footer);
