import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';

import injectT from '../../../i18n/injectT';
import WrappedText from '../../../shared/wrapped-text/WrappedText';
import { getServiceMapUrl } from '../../../utils/unitUtils';
import ReservationInfo from '../reservation-info/ReservationInfo';

function ResourceInfo({
  isLoggedIn, resource, unit, t, currentEquipments
}) {
  const serviceMapUrl = getServiceMapUrl(unit);
  const userLocale = localStorage.getItem('userLocale');
  const equipment = currentEquipments.map((item, i) => {
    let itemName = '';
    if (userLocale === 'en') {
      itemName = item.name.en;
    } else if (userLocale === 'se') {
      itemName = item.name.sv;
    } else {
      itemName = item.name.fi;
    }
    return <Col key={i} lg={3} md={3} xs={6}>{itemName}</Col>;
  });

  return (
    <Row>
      <section className="app-ResourceInfo">
        <div className="app-ResourceInfo__description">
          {resource.description && <WrappedText openLinksInNewTab text={resource.description} />}
        </div>
        <Panel defaultExpanded header={t('ResourceInfo.reservationTitle')}>
          <ReservationInfo isLoggedIn={isLoggedIn} resource={resource} />
        </Panel>
        <Panel defaultExpanded header={t('ResourceInfo.additionalInfoTitle')}>
          <Row>
            <Col className="app-ResourceInfo__address" xs={6}>
              {unit && unit.name && <span>{unit.name}</span>}
              {unit && unit.streetAddress && <span>{unit.streetAddress}</span>}
              {unit && <span>{`${unit.addressZip} ${upperFirst(unit.municipality)}`.trim()}</span>}
            </Col>
            <Col className="app-ResourceInfo__web" xs={6}>
              {serviceMapUrl && (
                <span className="app-ResourceInfo__servicemap">
                  <a href={serviceMapUrl} rel="noopener noreferrer" target="_blank">
                    {t('ResourceInfo.serviceMapLink')}
                  </a>
                </span>
              )}
              {unit && unit.wwwUrl && (
                <span className="app-ResourceInfo__www">
                  <a href={unit.wwwUrl} rel="noopener noreferrer" target="_blank">
                    {unit.wwwUrl}
                  </a>
                </span>
              )}
            </Col>
          </Row>
        </Panel>
        <Panel>
          <h4>Equipment</h4>
          <Row>{equipment}</Row>
        </Panel>
      </section>
    </Row>
  );
}

ResourceInfo.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
  currentEquipments: PropTypes.array.isRequired
};

ResourceInfo = injectT(ResourceInfo); // eslint-disable-line

export default ResourceInfo;
