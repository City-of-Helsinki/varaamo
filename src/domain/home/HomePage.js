import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Loader from 'react-loader';
import camelCase from 'lodash/camelCase';
import Link from 'react-router-dom/Link';

import HomeSearchBox from './HomeSearchBox';
import iconManufacturing from './images/frontpage_build.svg';
import iconPhotoAndAudio from './images/frontpage_music.svg';
import iconSports from './images/frontpage_sport.svg';
import iconGuidance from './images/frontpage_guidance.svg';
import iconMeetingsAndWorking from './images/frontpage_work.svg';
import iconOrganizeEvents from './images/frontpage_event.svg';
import iconSauna from './images/frontpage_sauna.svg';
import client from '../../common/api/client';
import FAIcon from '../../../app/shared/fontawesome-icon/FontAwesomeIcon';
import PageWrapper from '../../../app/pages/PageWrapper';
import injectT from '../../../app/i18n/injectT';

const purposeIcons = {
  photoAndAudio: iconPhotoAndAudio,
  sports: iconSports,
  guidance: iconGuidance,
  manufacturing: iconManufacturing,
  meetingsAndWorking: iconMeetingsAndWorking,
  events: iconOrganizeEvents,
  sauna: iconSauna,
};

class HomePage extends Component {
  state = {
    isFetchingPurposes: false,
    purposes: null,
  }

  componentDidMount() {
    this.fetchPurposes();
  }

  fetchPurposes = async () => {
    this.setState({ isFetchingPurposes: true });
    try {
      const response = await client.get('purpose');
      this.setState({ isFetchingPurposes: false, purposes: response.data.results });
    } catch (errors) {
      this.setState({ isFetchingPurposes: false });
      // TODO: HTTP error handler
    }
  }

  handleSearch = (value = '') => {
    this.props.history.push(`/search?search=${value}`);
  }

  renderPurposeBanners = () => {
    const { t, locale } = this.props;
    const { purposes } = this.state;

    const normalizedPurpose = purposes.filter(purpose => !purpose.parent).sort();

    return normalizedPurpose.map((purpose) => {
      const image = purposeIcons[camelCase(purpose.id)];
      const purposeName = purpose.name[locale] || '';

      return (
        <Col className="app-HomePageContent__banner" key={purpose.id} md={3} sm={6} xs={12}>
          <Link className="app-HomePageContent__banner__linkWrapper" to={`/search?purpose=${purpose.id}`}>
            <div className="app-HomePageContent__banner-icon">
              {typeof image === 'string' ? <img alt={purposeName} src={image} />
              // TODO: VAR-80 | VAR-81 Replace those icon with designed icon.

                : <FAIcon icon={image} />}
            </div>

            <h5>{purposeName}</h5>
            <div className="app-HomePageContent__banner-action">
              <Button
                bsStyle="primary"
                className="app-HomePageContent__button"
              >
                {t('HomePage.buttonText')}
              </Button>
            </div>
          </Link>
        </Col>
      );
    });
  }

  render() {
    const { t } = this.props;
    const { purposes, isFetchingPurposes } = this.state;

    return (
      <div className="app-HomePage">
        <div className="app-HomePage__content container">
          <h1>Varaamo –</h1>
          <h1>{t('HomePage.contentTitle')}</h1>
          <h5>{t('HomePage.contentSubTitle')}</h5>
          <HomeSearchBox onSearch={this.handleSearch} />
        </div>
        <div className="app-HomePage__koro" />
        <PageWrapper className="app-HomePageContent" title={t('HomePage.title')}>
          <h4>{t('HomePage.bannersTitle')}</h4>
          {purposes && (
            <Loader loaded={!isFetchingPurposes}>
              <div className="app-HomePageContent__banners">
                <Row>
                  {this.renderPurposeBanners()}
                </Row>
              </div>
            </Loader>
          )}
        </PageWrapper>
      </div>
    );
  }
}

HomePage.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

export default injectT(HomePage);
