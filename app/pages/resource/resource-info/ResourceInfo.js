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
import Equipment from '../resource-equipment/ResourceEquipment';

function ResourceInfo({
  isLoggedIn, resource, unit, t
}) {
  const serviceMapUrl = getServiceMapUrl(unit);

  return (
    <Row>
      <section className="app-ResourceInfo">
        <Panel>
          <Panel.Heading>
            <Panel.Title componentClass="h3">{t('ResourceInfo.descriptionTitle')}</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <div className="app-ResourceInfo__description">
              {resource.description && <WrappedText openLinksInNewTab text={resource.description} />}
            </div>
          </Panel.Body>
        </Panel>
        <Panel>
          <Panel.Heading>
            <Panel.Title componentClass="h3">{t('ResourceInfo.reservationTitle')}</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <ReservationInfo isLoggedIn={isLoggedIn} resource={resource} />
          </Panel.Body>
        </Panel>
        {resource.specificTerms && (
          <Panel>
            <Panel.Heading>
              <Panel.Title componentClass="h3">{t('ResourcePage.specificTerms')}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <Row>
                <Col xs={12}>{resource.specificTerms}</Col>
              </Row>
            </Panel.Body>
          </Panel>
        )}
        <Panel>
          <Panel.Heading>
            <Panel.Title componentClass="h3">{t('ResourceInfo.additionalInfoTitle')}</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
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
          </Panel.Body>
        </Panel>
        <Equipment equipment={resource.equipment} />
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

ResourceInfo = injectT(ResourceInfo); // eslint-disable-line

export default ResourceInfo;
