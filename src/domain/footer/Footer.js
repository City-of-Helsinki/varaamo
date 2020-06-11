import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import { Link } from 'react-router-dom';

import { version } from '../../../package.json';
import FeedbackLink from '../../../app/shared/feedback-link/FeedbackLink';
import Logo from '../../../app/shared/logo/Logo';
import injectT from '../../../app/i18n/injectT';
import { getCurrentCustomization } from '../../../app/utils/customizationUtils';

function Footer({ t }) {
  const feedbackLink = <FeedbackLink>{t('Footer.feedbackLink')}</FeedbackLink>;

  let cityNameId;
  switch (getCurrentCustomization()) {
    case 'ESPOO':
      cityNameId = 'Footer.espooText';
      break;
    case 'VANTAA':
      cityNameId = 'Footer.vantaaText';
      break;
    case 'HELSINKI':
    default:
      cityNameId = 'Footer.helsinkiText';
  }

  return (
    <footer>
      <Grid>
        <Row>
          <Col lg={3} md={3} xs={12}>
            <Link className="brand-link" to="/">
              <Logo />
              Varaamo
            </Link>
          </Col>
          <Col lg={6} md={6} xs={12}>
            <p>{t(cityNameId)}</p>
            <p>{feedbackLink}</p>
          </Col>
          <Col lg={3} md={3} xs={12}>
            <div className="app-varaamo-version-wrapper">
              <span className="app-varaamo-version">{`v${version}`}</span>
            </div>
          </Col>
        </Row>
      </Grid>
    </footer>
  );
}
Footer.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(Footer);
