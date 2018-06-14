import upperFirst from 'lodash/upperFirst';
import React, { PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';

import { injectT } from 'i18n';
import WrappedText from 'shared/wrapped-text';
import { getTermsAndConditions } from 'utils/resourceUtils';
import { getServiceMapUrl } from 'utils/unitUtils';
import ReservationInfo from '../reservation-info';

function ResourceInfo({ isLoggedIn, resource, unit, t }) {
  const termsAndConditions = getTermsAndConditions(resource);
  const serviceMapUrl = getServiceMapUrl(unit);

  return (
    <Row>
      <section className="app-ResourceInfo">
        <div className="app-ResourceInfo__description">
          {resource.description && <WrappedText text={resource.description} />}
        </div>
        <Panel collapsible defaultExpanded header={t('ResourceInfo.reservationTitle')}>
          {termsAndConditions &&
            <WrappedText className="app-ResourceInfo__terms" text={termsAndConditions} />
          }
          <ReservationInfo
            isLoggedIn={isLoggedIn}
            resource={resource}
          />
        </Panel>
        <Panel collapsible defaultExpanded header={t('ResourceInfo.additionalInfoTitle')}>
          <Row>
            <Col className="app-ResourceInfo__address" xs={6}>
              {unit && unit.name && <span>{unit.name}</span>}
              {unit && unit.streetAddress && <span>{unit.streetAddress}</span>}
              {unit &&
                <span>{`${unit.addressZip} ${upperFirst(unit.municipality)}`.trim()}</span>
              }
            </Col>
            <Col className="app-ResourceInfo__web" xs={6}>
              {serviceMapUrl &&
                <span className="app-ResourceInfo__servicemap">
                  <a href={serviceMapUrl}>{t('ResourceInfo.serviceMapLink')}</a>
                </span>
              }
              {unit && unit.wwwUrl &&
                <span className="app-ResourceInfo__www">
                  <a href={unit.wwwUrl}>{unit.wwwUrl}</a>
                </span>
              }
            </Col>
          </Row>
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
};

ResourceInfo = injectT(ResourceInfo);  // eslint-disable-line

export default ResourceInfo;
