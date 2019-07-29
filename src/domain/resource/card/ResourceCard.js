import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import flowRight from 'lodash/flowRight';
import iconHome from 'hel-icons/dist/shapes/home.svg';
import iconMapMarker from 'hel-icons/dist/shapes/map-marker.svg';
import iconTicket from 'hel-icons/dist/shapes/ticket.svg';
import iconUser from 'hel-icons/dist/shapes/user-o.svg';
import iconHeart from 'hel-icons/dist/shapes/heart-o.svg';

import injectT from '../../../../app/i18n/injectT';
import iconMap from '../../../../app/assets/icons/map.svg';
import iconHeartFilled from '../../../../app/assets/icons/heart-filled.svg';
import * as dataUtils from '../../../common/data/utils';
import * as urlUtils from '../../../common/url/utils';
import * as searchUtils from '../../search/utils';
import * as resourceUtils from '../utils';
import BackgroundImage from '../../../../app/shared/background-image/BackgroundImage';
import { getMainImage } from '../../../../app/utils/imageUtils';
import ResourceAvailability from '../../../../app/shared/resource-card/resource-availability/ResourceAvailability';
import UnpublishedLabel from '../../../../app/shared/label/unpublished/UnpublishedLabel';
import ResourceCardInfoCell from './ResourceCardInfoCell';
import { isLoggedInSelector } from '../../../../app/state/selectors/authSelectors';


class ResourceCard extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    resource: PropTypes.object.isRequired,
    unit: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    history: PropTypes.object,
    intl: intlShape.isRequired,
    isStacked: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    onFavoriteClick: PropTypes.func.isRequired,
    onFilterClick: PropTypes.func.isRequired,
  };

  getResourcePageLink = () => {
    const { date, resource } = this.props;

    return {
      pathname: resourceUtils.getResourcePageLink(resource),
      search: date ? urlUtils.getSearch({ date }) : '',
      state: { fromSearchResults: true },
    };
  };

  onSearchClick = (filters) => {
    const { history } = this.props;
    history.push(searchUtils.getSearchPageLink(filters));
  };

  render() {
    const {
      date,
      isLoggedIn,
      isStacked,
      resource,
      onFavoriteClick,
      onFilterClick,
      unit,
      intl,
      t,
    } = this.props;
    const locale = intl.locale;
    const typeName = resource.type ? dataUtils.getLocalizedFieldValue(resource.type.name, locale) : '';

    return (
      <div
        className={classNames('app-resourceCard', {
          'app-resourceCard__stacked': isStacked,
        })}
      >
        <Link className="app-resourceCard__image-link" onClick={this.handleLinkClick} to={this.getResourcePageLink()}>
          <BackgroundImage height={420} image={getMainImage(resource.images)} width={700} />
        </Link>
        <div className="app-resourceCard__content">
          <div className="app-resourceCard__unit-name">
            <a
              className="app-resourceCard__unit-name-link"
              onClick={() => this.onSearchClick({ unit: resource.unit })}
              role="button"
              tabIndex="-1"
            >
              <span>{dataUtils.getLocalizedFieldValue(unit.name, locale)}</span>
            </a>
            <div className="app-resourceCard__unit-name-labels">
              <ResourceAvailability date={date} resource={resource} />
              {!resource.public && <UnpublishedLabel />}
            </div>
          </div>
          <Link onClick={this.handleLinkClick} to={this.getResourcePageLink()}>
            <h4>{dataUtils.getLocalizedFieldValue(resource.name, locale)}</h4>
          </Link>
          <div className="app-resourceCard__description">
            {dataUtils.getLocalizedFieldValue(resource.description, locale)}
          </div>
        </div>
        <div className="app-resourceCard__info">
          {resource.type && (
            <ResourceCardInfoCell
              icon={iconHome}
              onClick={() => onFilterClick('search', typeName)}
              text={typeName}
            />
          )}
          <ResourceCardInfoCell
            icon={iconUser}
            onClick={
              resource.people_capacity
                ? () => onFilterClick('people', searchUtils.getClosestPeopleCapacityOption(resource.people_capacity))
                : null
            }
            text={
              resource.people_capacity
                ? t('ResourceCard.peopleCapacity', { people: resource.people_capacity })
                : '-'
            }
          />
          <ResourceCardInfoCell
            icon={iconTicket}
            onClick={resourceUtils.isFree(resource) ? () => onFilterClick('freeOfCharge', true) : null}
            text={resourceUtils.getPrice(resource, t)}
          />
          <ResourceCardInfoCell
            icon={iconMap}
            text={resourceUtils.getUnitAddress(unit, locale)}
          />
          {resource.distance && (
            <ResourceCardInfoCell
              icon={iconMapMarker}
              onClick={() => null}
              text={resourceUtils.getResourceDistance(resource)}
            />
          )}
          {isLoggedIn && (
            <ResourceCardInfoCell
              alt={typeName}
              icon={resource.is_favorite ? iconHeartFilled : iconHeart}
              onClick={() => onFavoriteClick(resource)}
            />
          )}
        </div>
      </div>
    );
  }
}

const UnconnectedResourceCard = injectT(ResourceCard);
export { UnconnectedResourceCard };

const selector = createStructuredSelector({
  isLoggedIn: isLoggedInSelector,
});

export default flowRight([
  injectIntl,
  connect(selector),
])(UnconnectedResourceCard);
