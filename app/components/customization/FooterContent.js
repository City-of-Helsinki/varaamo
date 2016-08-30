import React, { Component } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import { Link } from 'react-router';

import FeedbackLink from 'components/customization/FeedbackLink';
import Logo from 'components/customization/Logo';
import { getCurrentCustomization } from 'utils/CustomizationUtils';

class FooterContent extends Component {
  render() {
    switch (getCurrentCustomization()) {

      case 'ESPOO': {
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
                <p>
                  Varaamo on Helsingin kaupungin tilanvarauspalvelu, jota kokeillaan vuoden ajan
                  tietyissä Espoon kaupunginkirjaston tiloissa. Kyseessä on pilottiversio, josta
                  toivomme Sinulta palautetta.
                  Palautteesi voit lähettää <FeedbackLink text="täältä" />.
                </p>
              </Col>
            </Row>
          </Grid>
        );
      }

      default: {
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
                  Palautteesi voit lähettää <FeedbackLink text="täältä" />.
                </p>
              </Col>
            </Row>
          </Grid>
        );
      }
    }
  }
}

FooterContent.propTypes = {};

export default FooterContent;
