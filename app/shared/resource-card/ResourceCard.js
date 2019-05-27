import classNames from 'classnames';
import round from 'lodash/round';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import iconHome from 'hel-icons/dist/shapes/home.svg';
import iconMapMarker from 'hel-icons/dist/shapes/map-marker.svg';
import iconTicket from 'hel-icons/dist/shapes/ticket.svg';
import iconUser from 'hel-icons/dist/shapes/user-o.svg';
import iconHeart from 'hel-icons/dist/shapes/heart-o.svg';

import { injectT } from 'i18n';
import iconHeartFilled from 'assets/icons/heart-filled.svg';
import UnpublishedLabel from 'shared/label/Unpublished';
import iconMap from 'assets/icons/map.svg';
import BackgroundImage from 'shared/background-image';
import { getMainImage } from 'utils/imageUtils';
import { getHourlyPrice, getResourcePageUrlComponents } from 'utils/resourceUtils';
import ResourceAvailability from './label';
import ResourceCardInfoCell from './info';
import resourceCardSelector from './resourceCardSelector';
import {
  favoriteResource,
  unfavoriteResource
} from 'actions/resourceActions';

class ResourceCard extends Component {
  handleSearchByType = () => {
    const filters = { search: this.props.resource.type.name };
    this.props.history.push(`/search?${queryString.stringify(filters)}`);
  };

  handleSearchByDistance = () => {
    const filters = { distance: this.props.resource.distance };
    this.props.history.push(`/search?${queryString.stringify(filters)}`);
  };

  handleSearchByPeopleCapacity = () => {
    const filters = { people: this.props.resource.peopleCapacity };
    this.props.history.push(`/search?${queryString.stringify(filters)}`);
  };

  handleSearchByUnit = () => {
    const filters = { unit: this.props.unit.id };
    this.props.history.push(`/search?${queryString.stringify(filters)}`);
  };

  handleLinkClick = () => {
    const scrollTop = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop;
    const { location, history } = this.props;
    const { pathname, search } = location;
    history.replace({ pathname, search, state: { scrollTop } });
  };

  renderDistance(distance) {
    const km = distance / 1000;
    let formatedDistance = round(km);
    if (km < 10) {
      formatedDistance = round(km, 1);
    }
    return `${formatedDistance} km`;
  }

  render() {
    const {
      date, resource, t, unit, actions, isLoggedIn
    } = this.props;
    const { pathname, query } = getResourcePageUrlComponents(resource, date);
    const linkTo = {
      pathname,
      search: query ? `?${query}` : undefined,
      state: { fromSearchResults: true },
    };

    return (
      <div
        className={classNames('app-ResourceCard', {
          'app-ResourceCard__stacked': this.props.stacked,
        })}
      >
        <Link className="app-ResourceCard__image-link" onClick={this.handleLinkClick} to={linkTo}>
          <BackgroundImage height={420} image={getMainImage(resource.images)} width={700} />
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
            <div className="app-ResourceCard__unit-name-labels">
              <ResourceAvailability date={date} resource={resource} />
              {!resource.public && <UnpublishedLabel />}
            </div>
          </div>
          <Link onClick={this.handleLinkClick} to={linkTo}>
            <h4>{resource.name}</h4>
          </Link>
          <div className="app-ResourceCard__description">{resource.description}</div>
        </div>

        <div className="app-ResourceCard__info">
          <ResourceCardInfoCell
            alt={resource.type.name}
            icon={iconHome}
            onClick={this.handleSearchByType}
          >
            <span>
              {resource.type ? resource.type.name : '\u00A0'}
            </span>
          </ResourceCardInfoCell>

          <ResourceCardInfoCell
            alt={resource.type.name}
            icon={iconUser}
            onClick={this.handleSearchByPeopleCapacity}
          >
            <span className="app-ResourceCard__peopleCapacity">
              {t('ResourceCard.peopleCapacity', { people: resource.peopleCapacity })}
            </span>
          </ResourceCardInfoCell>

          <ResourceCardInfoCell
            alt={resource.type.name}
            icon={iconTicket}
          >
            <span className="app-ResourceCard__hourly-price">
              {getHourlyPrice(t, resource) || '\u00A0'}
            </span>
          </ResourceCardInfoCell>

          <ResourceCardInfoCell
            alt={resource.type.name}
            icon={iconMap}
          >
            <Fragment>
              <span className="app-ResourceCard__street-address">
                {unit.streetAddress}
              </span>
              <span className="app-ResourceCard__zip-address">
                {unit.addressZip}
                {' '}
                {unit.municipality}
              </span>
            </Fragment>
          </ResourceCardInfoCell>

          <ResourceCardInfoCell
            alt={resource.type.name}
            icon={iconMapMarker}
            onClick={this.handleSearchByDistance}
          >
            <span className="app-ResourceCard__distance">
              {resource.distance ? this.renderDistance(resource.distance) : '\u00A0'}
            </span>
          </ResourceCardInfoCell>

          {isLoggedIn
            && (
            <ResourceCardInfoCell
              alt={resource.type.name}
              icon={resource.isFavorite ? iconHeartFilled : iconHeart}
              onClick={
              resource.isFavorite
                ? () => actions.unfavoriteResource(resource.id)
                : () => actions.favoriteResource(resource.id)
            }
            />
            )
          }
        </div>
      </div>
    );
  }
}

ResourceCard.propTypes = {
  date: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  stacked: PropTypes.bool,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
  actions: PropTypes.object,
  isLoggedIn: PropTypes.bool,
};

const UnconnectedResourceCard = injectT(ResourceCard);


function mapDispatchToProps(dispatch) {
  const actionCreators = {
    favoriteResource,
    unfavoriteResource,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedResourceCard };

export default connect(resourceCardSelector, mapDispatchToProps)(UnconnectedResourceCard);
