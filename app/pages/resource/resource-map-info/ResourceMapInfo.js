import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import iconMapMarker from 'hel-icons/dist/shapes/map-marker.svg';
import { upperFirst } from 'lodash';

import { injectT } from 'i18n';
import { getServiceMapUrl } from 'utils/unitUtils';

function formatAddress({ addressZip, municipality, streetAddress }) {
  const parts = [streetAddress, `${addressZip} ${upperFirst(municipality)}`.trim()];
  return parts.filter(part => part).join(', ');
}

function ResourceMapInfo({ unit, t }) {
  return (
    <div className="app-ResourceMapInfo">
      <Grid>
        {unit && (
          <div className="app-ResourceMapInfo__content">
            <img
              alt={t('ResourceInfo.serviceMapLink')}
              className="app-ResourceMapInfo__icon"
              src={iconMapMarker}
            />
            <span>{formatAddress(unit)}</span>
            <Button bsStyle="link" href={getServiceMapUrl(unit)}>
              {t('ResourceInfo.serviceMapLink')}
            </Button>
          </div>
        )}
      </Grid>
    </div>
  );
}

ResourceMapInfo.propTypes = {
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

ResourceMapInfo = injectT(ResourceMapInfo); // eslint-disable-line

export default ResourceMapInfo;
