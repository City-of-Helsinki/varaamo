import classnames from 'classnames';
import round from 'lodash/round';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import { browserHistory, Link } from 'react-router';
import Col from 'react-bootstrap/lib/Col';
import iconHome from 'hel-icons/dist/shapes/home.svg';
import iconMapMarker from 'hel-icons/dist/shapes/map-marker.svg';
import iconTicket from 'hel-icons/dist/shapes/ticket.svg';
import iconUser from 'hel-icons/dist/shapes/user-o.svg';

import { injectT } from 'i18n';
import iconMap from 'assets/icons/map.svg';
import BackgroundImage from 'shared/background-image';
import { getMainImage } from 'utils/imageUtils';
import { getResourcePageUrl, getHourlyPrice } from 'utils/resourceUtils';
import ResourceAvailability from './ResourceAvailability';

class ResourceCard extends Component {

  handleSearchByType = () => {
    const filters = { search: this.props.resource.type.name };
    browserHistory.push(`/search?${queryString.stringify(filters)}`);
  }

  handleSearchByDistance = () => {
    const filters = { distance: this.props.resource.distance };
    browserHistory.push(`/search?${queryString.stringify(filters)}`);
  }

  handleSearchByPeopleCapacity = () => {
    const filters = { people: this.props.resource.peopleCapacity };
    browserHistory.push(`/search?${queryString.stringify(filters)}`);
  }

  handleSearchByUnit = () => {
    const filters = { unit: this.props.unit.id };
    browserHistory.push(`/search?${queryString.stringify(filters)}`);
  }

  handleLinkClick = () => {
    const scrollTop = window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    const { location } = this.props;
    const { pathname, search } = location;
    browserHistory.replace({ pathname, search, state: { scrollTop } });
  }

  renderDistance(distance) {
    const km = distance / 1000;
    let formatedDistance = round(km);
    if (km < 10) {
      formatedDistance = round(km, 1);
    }
    return `${formatedDistance} km`;
  }

  render() {
    const { date, resource, t, unit } = this.props;

    return (
      <div
        className={classnames(
          'app-ResourceCard',
          { 'app-ResourceCard__stacked': this.props.stacked },
        )}

      >
        <Link
          className="app-ResourceCard__image-link"
          onClick={this.handleLinkClick}
          to={getResourcePageUrl(resource, date)}
        >
          <BackgroundImage
            height={420}
            image={getMainImage(resource.images)}
            width={700}
          />
        </Link>
        <div className="app-ResourceCard__content">
          <div className="app-ResourceCard__unit-name">
            <a
              className="app-ResourceCard__unit-name-link"
              onClick={this.handleSearchByUnit}
              role="button"
              tabIndex="-1"
            >
              <span>{unit.name}</span>
            </a>
            <ResourceAvailability date={date} resource={resource} />
          </div>
          <Link onClick={this.handleLinkClick} to={getResourcePageUrl(resource, date)}>
            <h4>{resource.name}</h4>
          </Link>
          <div className="app-ResourceCard__description">
            {resource.description}
          </div>
        </div>
        <div className="app-ResourceCard__info">
          <Col md={4} sm={2} xs={4}>
            <a
              className="app-ResourceCard__info-link app-ResourceCard__info-link-capitalize"
              onClick={this.handleSearchByType}
              role="button"
              tabIndex="-1"
            >
              <img alt={resource.type.name} className="app-ResourceCard__info-icon" src={iconHome} />
              <span className="app-ResourceCard__info-label">{resource.type ? resource.type.name : '\u00A0'}</span>
            </a>
          </Col>
          <Col md={4} sm={2} xs={4}>
            <a
              className="app-ResourceCard__info-link"
              onClick={this.handleSearchByPeopleCapacity}
              role="button"
              tabIndex="-1"
            >
              <img alt={resource.peopleCapacity} className="app-ResourceCard__info-icon" src={iconUser} />
              <span className="app-ResourceCard__info-label app-ResourceCard__peopleCapacity">
                {t('ResourceCard.peopleCapacity', { people: resource.peopleCapacity })}
              </span>
            </a>
          </Col>
          <Col md={4} sm={2} xs={4}>
            <div className="app-ResourceCard__info-detail">
              <img alt={resource.type.name} className="app-ResourceCard__info-icon" src={iconTicket} />
              <span className="app-ResourceCard__info-label app-ResourceCard__hourly-price">
                {getHourlyPrice(t, resource) || '\u00A0'}
              </span>
            </div>
          </Col>
          <Col md={4} sm={3} xs={4}>
            <div className="app-ResourceCard__info-detail">
              <img alt={resource.type.name} className="app-ResourceCard__info-icon" src={iconMap} />
              <span className="app-ResourceCard__info-label app-ResourceCard__street-address">{unit.streetAddress}</span>
              <span className="app-ResourceCard__info-label app-ResourceCard__zip-address">{unit.addressZip} {unit.municipality}</span>
            </div>
          </Col>
          <Col md={4} sm={2} xs={4}>
            <a
              className="app-ResourceCard__info-link"
              onClick={this.handleSearchByDistance}
              role="button"
              tabIndex="-1"
            >
              <img alt={resource.type.name} className="app-ResourceCard__info-icon" src={iconMapMarker} />
              <span className="app-ResourceCard__info-label app-ResourceCard__distance">
                {resource.distance ? this.renderDistance(resource.distance) : '\u00A0'}
              </span>
            </a>
          </Col>
        </div>
      </div>
    );
  }
}

ResourceCard.propTypes = {
  date: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  stacked: PropTypes.bool,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

export default injectT(ResourceCard);
