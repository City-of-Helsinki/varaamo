import Radium from 'radium';
import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

import { FEEDBACK_URL } from 'constants/AppConstants';

import styles from './Footer.styles';
import logoSrc from 'assets/images/helsinki-coat-of-arms-white.png';

class Footer extends Component {
  handleFeedbackClick(event) {
    event.preventDefault();
    const refUrl = window.location.href;
    window.location = `${FEEDBACK_URL}?ref=${refUrl}`;
  }

  render() {
    const RadiumLink = Radium(Link);
    const feedbackLink = (
      <a
        href={FEEDBACK_URL}
        onClick={this.handleFeedbackClick}
        style={styles.link}
      >
        täältä
      </a>
    );

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
              <p>
                Varaamo on Helsingin kaupungin tilanvarauspalvelu.
                Kyseessä on pilottiversio, josta toivomme Sinulta palautetta.
                Palautteesi voit lähettää {feedbackLink}.
              </p>
            </Col>
          </Row>
        </Grid>
      </footer>
    );
  }
}

Footer.propTypes = {};

export default Radium(Footer);
