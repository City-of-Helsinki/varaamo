import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import camelCase from 'lodash/camelCase';
import Link from 'react-router-dom/Link';

import { fetchPurposes } from 'actions/purposeActions';
import { injectT } from 'i18n';
import PageWrapper from 'pages/PageWrapper';
import HomeSearchBox from './HomeSearchBox';
import homePageSelector from './homePageSelector';
import iconManufacturing from './images/frontpage_build.svg';
import iconPhotoAndAudio from './images/frontpage_music.svg';
import iconSports from './images/frontpage_sport.svg';
import iconGuidance from './images/frontpage_guidance.svg';
import iconMeetingsAndWorking from './images/frontpage_work.svg';

const purposeIcons = {
  photoAndAudio: iconPhotoAndAudio,
  sports: iconSports,
  guidance: iconGuidance,
  manufacturing: iconManufacturing,
  meetingsAndWorking: iconMeetingsAndWorking,
};

class UnconnectedHomePage extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.renderPurposeBanner = this.renderPurposeBanner.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchPurposes();
  }

  handleSearch(value = '') {
    this.props.history.push(`/search?search=${value}`);
  }

  renderPurposeBanner(purpose) {
    const { t } = this.props;
    const image = purposeIcons[camelCase(purpose.value)];
    return (
      <Col className="app-HomePageContent__banner" key={purpose.value} md={3} sm={6} xs={12}>
        <Link className="app-HomePageContent__banner__linkWrapper" to={`/search?purpose=${purpose.value}`}>
          <img alt={purpose.label} src={image} />
          <h5>{purpose.label}</h5>
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
  }

  render() {
    const { isFetchingPurposes, purposes, t } = this.props;
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
          <Loader loaded={!isFetchingPurposes}>
            <div className="app-HomePageContent__banners">
              {purposes.map(this.renderPurposeBanner)}
            </div>
          </Loader>
        </PageWrapper>
      </div>
    );
  }
}

UnconnectedHomePage.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingPurposes: PropTypes.bool.isRequired,
  purposes: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

UnconnectedHomePage = injectT(UnconnectedHomePage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = { fetchPurposes };
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedHomePage };
export default connect(
  homePageSelector,
  mapDispatchToProps,
)(UnconnectedHomePage);
