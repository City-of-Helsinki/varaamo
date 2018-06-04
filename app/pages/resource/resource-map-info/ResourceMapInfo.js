import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import iconMapMarker from 'hel-icons/dist/shapes/map-marker.svg';
import { round, upperFirst } from 'lodash';

import { injectT } from 'i18n';
import { getServiceMapUrl } from 'utils/unitUtils';

function getAddress({ distance }, { addressZip, municipality, streetAddress }) {
  const km = distance ? distance / 1000 : 0;
  const formatedDistance = km < 10 ? round(km, 1) : round(km);
  const distanceStr = km ? `${formatedDistance} km` : '';
  const parts = [
    distanceStr,
    streetAddress,
    `${addressZip} ${upperFirst(municipality)}`.trim(),
  ];
  return parts.filter(part => part).join(', ');
}

function ResourceMapInfo({ resource, unit, t }) {
  return (
    <div className="app-ResourceMapInfo">
      <Grid>
        {unit &&
          <div className="app-ResourceMapInfo__content">
            <img alt={t('ResourceInfo.serviceMapLink')} src={iconMapMarker} />
            <span>{getAddress(resource, unit)}</span>
            <Button
              bsStyle="link"
              href={getServiceMapUrl(unit)}
            >
              {t('ResourceInfo.serviceMapLink')}
            </Button>
          </div>
        }
      </Grid>
    </div>
  );
}

ResourceMapInfo.propTypes = {
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

ResourceMapInfo = injectT(ResourceMapInfo);  // eslint-disable-line

export default ResourceMapInfo;
