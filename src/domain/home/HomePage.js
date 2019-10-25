import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Loader from 'react-loader';
import camelCase from 'lodash/camelCase';
import Link from 'react-router-dom/Link';
import { Icon } from 'react-icons-kit';
import {
  basic_hammer as Hammer,
  music_recordplayer as Player,
  basic_magnifier as Guidance,
  basic_elaboration_calendar_search as Calendar,
  basic_laptop as MeetingAndWorking,
} from 'react-icons-kit/linea';
import {
  futbolO as Sport,
  bathtub as Sauna,
} from 'react-icons-kit/fa/';

import HomeSearchBox from './HomeSearchBox';
import client from '../../common/api/client';
import PageWrapper from '../../../app/pages/PageWrapper';
import injectT from '../../../app/i18n/injectT';

const purposeIcons = {
  photoAndAudio: Player,
  sports: Sport,
  guidance: Guidance,
  manufacturing: Hammer,
  meetingsAndWorking: MeetingAndWorking,
  events: Calendar,
  sauna: Sauna
};

class HomePage extends Component {
  state = {
    isFetchingPurposes: false,
    purposes: null,
    isHovered: {},
    hovering: false,
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

  handleHover(purpose) {
    this.setState({
      isHovered: {
        [purpose]: true
      },
      hovering: true,
    });
  }

  handleMouseOut() {
    this.setState({
      isHovered: {},
      hovering: false,
    });
  }

  renderPurposeBanners = () => {
    const { t, locale } = this.props;
    const { purposes } = this.state;

    const normalizedPurpose = purposes.filter(purpose => !purpose.parent).sort();

    return normalizedPurpose.map((purpose) => {
      const image = purposeIcons[camelCase(purpose.id)];
      const purposeName = purpose.name[locale] || '';
      return (
        <>
          <Link
            className={`app-HomePageContent__banner__linkWrapper ${this.state.isHovered[purpose.id] ? 'hovered' : 'unhovered'}`}
            onMouseEnter={() => this.handleHover(purpose.id)}
            onMouseLeave={() => this.handleMouseOut(purpose.id)}
            to={`/search?purpose=${purpose.id}`}
          >
            <div className="app-HomePageContent__banner-icon">
              <div
                className={camelCase(purpose.id) === 'sauna' ? 'strokeFix' : ''}
              >
                <div
                  style={{
                    color: `${this.state.isHovered[purpose.id] ? '#0171C6' : '#000'}`
                  }}
                >
                  <Icon icon={image} size="3em" />
                </div>
              </div>
            </div>

            <h5>{purposeName}</h5>
          </Link>
        </>
      );
    });
  }

  render() {
    const { t } = this.props;
    const { purposes, isFetchingPurposes } = this.state;

    return (
      <div className="app-HomePage">
        <div className="app-HomePage__content container">
          <div className="searchBoxContent">
            <h1>Varaamo</h1>
            <h1>{t('HomePage.contentTitle')}</h1>
            <h5>{t('HomePage.contentSubTitle')}</h5>
            <HomeSearchBox onSearch={this.handleSearch} />
          </div>
        </div>
        <div className="app-HomePage__koro" />
        <PageWrapper className="app-HomePageContent" title={t('HomePage.title')}>
          <h2>{t('HomePage.bannersTitle')}</h2>
          {purposes && (
            <Loader loaded={!isFetchingPurposes}>
              <div className="app-HomePageContent __banners">
                <div className={`purposeContainer ${this.state.hovering ? 'hovering' : ''}`}>
                  {this.renderPurposeBanners()}
                </div>
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
  locale: PropTypes.string.isRequired
};

export default injectT(HomePage);
