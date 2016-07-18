import React, { Component } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import { Link } from 'react-router';

import FooterText from 'components/customization/FooterText';
import Logo from 'components/customization/Logo';

class Footer extends Component {
  render() {
    return (
      <footer>
        <Grid>
          <Row>
            <Col lg={3} md={3}>
              <Link className="brand-link" to="/">
                <Logo />
                Varaamo
              </Link>
            </Col>
            <Col lg={6} md={6}>
              <FooterText />
            </Col>
          </Row>
        </Grid>
      </footer>
    );
  }
}

Footer.propTypes = {};

export default Footer;
