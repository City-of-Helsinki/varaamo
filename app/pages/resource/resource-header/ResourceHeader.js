import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import iconHome from 'hel-icons/dist/shapes/home.svg';
import iconMapMarker from 'hel-icons/dist/shapes/map-marker.svg';
import iconTicket from 'hel-icons/dist/shapes/ticket.svg';
import iconUser from 'hel-icons/dist/shapes/user-o.svg';

import { injectT } from 'i18n';
import { getHourlyPrice, getMaxPeriodText } from 'utils/resourceUtils';
import iconClock from 'assets/icons/clock-o.svg';
import iconMap from 'assets/icons/map.svg';
import FavoriteButton from 'shared/favorite-button';

function ResourceHeader({ onBackClick, onMapClick, isLoggedIn, resource, showMap, unit, t }) {
  const peopleCapacityText = t('ResourceCard.peopleCapacity', { people: resource.peopleCapacity });
  const maxPeriodText = getMaxPeriodText(t, resource);
  const priceText = getHourlyPrice(t, resource);
  const typeName = resource.type ? resource.type.name : '\u00A0';

  return (
    <section className="app-ResourceHeader">
      <Grid>
        <div className="app-ResourceHeader__content">
          <Button
            bsStyle="link"
            className="app-ResourceHeader__back-button"
            onClick={onBackClick}
          >
            {t('ResourceHeader.backButton')}
          </Button>
          <h1>{resource.name}</h1>
          <div className="app-ResourceHeader__info-wrapper">
            <div className="app-ResourceHeader__info">
              <img alt={typeName} className="app-ResourceHeader__info-icon" src={iconHome} />
              <span className="app-ResourceHeader__info-label">{typeName}</span>
            </div>
            <div className="app-ResourceHeader__info">
              <img alt={peopleCapacityText} className="app-ResourceHeader__info-icon" src={iconUser} />
              <span className="app-ResourceHeader__info-label">{peopleCapacityText}</span>
            </div>
            <div className="app-ResourceHeader__info">
              <img alt={maxPeriodText} className="app-ResourceHeader__info-icon" src={iconClock} />
              <span className="app-ResourceHeader__info-label">{maxPeriodText}</span>
            </div>
            <div className="app-ResourceHeader__info">
              <img alt={priceText} className="app-ResourceHeader__info-icon" src={iconTicket} />
              <span className="app-ResourceHeader__info-label">{priceText}</span>
            </div>
            <div className="app-ResourceHeader__info">
              <img alt={unit.name} className="app-ResourceHeader__info-icon" src={iconMapMarker} />
              <span className="app-ResourceHeader__info-label">{unit.name}</span>
            </div>
            <div className="app-ResourceHeader__buttons">
              {!showMap &&
                <Button
                  className="app-ResourceHeader__map-button"
                  onClick={onMapClick}
                >
                  <img alt={t('ResourceHeader.mapButton')} src={iconMap} />
                  <span>{t('ResourceHeader.mapButton')}</span>
                </Button>
              }
              {showMap &&
                <Button
                  className="app-ResourceHeader__map-button"
                  onClick={onMapClick}
                >
                  <img alt={t('ResourceHeader.resourceButton')} src={iconMap} />
                  <span>{t('ResourceHeader.resourceButton')}</span>
                </Button>
              }
              {isLoggedIn && <FavoriteButton resource={resource} />}
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}

ResourceHeader.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onBackClick: PropTypes.func.isRequired,
  onMapClick: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  showMap: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

ResourceHeader = injectT(ResourceHeader);  // eslint-disable-line

export default ResourceHeader;
