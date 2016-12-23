import React, { PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import { Link } from 'react-router';

import FeedbackLink from 'shared/feedback-link';
import Logo from 'shared/logo';
import { injectT } from 'i18n';
import { getCurrentCustomization } from 'utils/customizationUtils';

function FooterContent({ t }) {
  const aboutLink = (
    <Link className="about-link" to="/about">
      {t('Footer.aboutLink')}
    </Link>
  );

  const feedbackLink = <FeedbackLink>{t('Footer.feedbackLink')}</FeedbackLink>;

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
              <p>{t('Footer.espooText')} {feedbackLink}</p>
              {aboutLink}
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
              <p>{t('Footer.helsinkiText')} {feedbackLink}</p>
              {aboutLink}
            </Col>
          </Row>
        </Grid>
      );
    }
  }
}

FooterContent.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(FooterContent);
