import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

import { FEEDBACK_URL } from 'constants/AppConstants';

import logoSrc from 'assets/images/helsinki-coat-of-arms-white.png';

class Footer extends Component {
  handleFeedbackClick(event) {
    event.preventDefault();
    const refUrl = window.location.href;
    window.location = `${FEEDBACK_URL}?ref=${refUrl}`;
  }

  render() {
    const feedbackLink = (
      <a
        className="feedback-link"
        href={FEEDBACK_URL}
        onClick={this.handleFeedbackClick}
      >
        täältä
      </a>
    );

    return (
      <footer>
        <Grid>
          <Row>
            <Col lg={3} md={3}>
              <Link className="brand-link" to="/">
                <img
                  alt="Helsingin vaakuna"
                  src={logoSrc}
                />
                Varaamo
              </Link>
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

export default Footer;
