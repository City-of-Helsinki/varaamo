import upperFirst from 'lodash/upperFirst';
import React, { PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import { Link } from 'react-router';

import { injectT } from 'i18n';
import WrappedText from 'shared/wrapped-text';
import { getTermsAndConditions } from 'utils/resourceUtils';
import ReservationInfo from '../reservation-info';

function orderImages(images) {
  return [].concat(
    images.filter(image => image.type === 'main'),
    images.filter(image => image.type !== 'main'),
  );
}

function ResourceInfo({ isLoggedIn, resource, unit, t }) {
  const termsAndConditions = getTermsAndConditions(resource);
  const images = orderImages(resource.images || []);
  return (
    <Row>
      <Col md={8} xs={12}>
        <section className="app-ResourceInfo">
          <div className="app-ResourceInfo__description">
            {resource.description && <WrappedText text={resource.description} />}
          </div>
          <Panel collapsible header={t('ResourceInfo.reservationTitle')}>
            {termsAndConditions &&
              <WrappedText className="app-ResourceInfo__terms" text={termsAndConditions} />
            }
            <ReservationInfo
              isLoggedIn={isLoggedIn}
              resource={resource}
            />
          </Panel>
          <Panel collapsible header={t('ResourceInfo.additionalInfoTitle')}>
            <Row>
              <Col className="app-ResourceInfo__address" xs={6}>
                {unit.name && <span>{unit.name}</span>}
                {unit.streetAddress && <span>{unit.streetAddress}</span>}
                <span>{`${unit.addressZip} ${upperFirst(unit.municipality)}`.trim()}</span>
              </Col>
              <Col className="app-ResourceInfo__web" xs={6}>
                {unit.wwwUrl &&
                  <Link to={unit.wwwUrl}>{unit.wwwUrl}</Link>
                }
              </Col>
            </Row>
          </Panel>
        </section>
      </Col>
      <Col md={4} xs={12}>
        {images.map(image => (
          <div className="app-ResourceInfo__image-wrapper" key={image.caption}>
            <img alt={image.caption} className="app-ResourceInfo__image" src={image.url} />
          </div>
        ))}
      </Col>
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
