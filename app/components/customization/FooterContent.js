import React, { Component } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import { Link } from 'react-router';

import Logo from 'components/customization/Logo';
import { FEEDBACK_URL } from 'constants/AppConstants';
import { getCurrentCustomization } from 'utils/CustomizationUtils';

class FooterContent extends Component {
  handleFeedbackClick(event) {
    event.preventDefault();
    const refUrl = window.location.href;
    window.location = `${FEEDBACK_URL}?ref=${refUrl}`;
  }

  render() {
    switch (getCurrentCustomization()) {

    case 'ESPOO':
      return (
        <Grid>
          <Row>
            <Col lg={4} md={4}>
              <Link className="brand-link" to="/">
                <Logo />
                Varaamo
              </Link>
            </Col>
            <Col lg={6} md={6}>
              <p>Placeholder text for Espoo footer.</p>
            </Col>
          </Row>
        </Grid>
      );

    default:
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
        <Grid>
          <Row>
            <Col lg={3} md={3}>
              <Link className="brand-link" to="/">
                <Logo />
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
      );
    }
  }
}

FooterContent.propTypes = {};

export default FooterContent;
