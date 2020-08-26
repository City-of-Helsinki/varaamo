import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import injectT from '../../../i18n/injectT';
import WrappedText from '../../../shared/wrapped-text/WrappedText';
import { getServiceMapUrl } from '../../../utils/unitUtils';
import ReservationInfo from '../reservation-info/ReservationInfo';
import Equipment from '../resource-equipment/ResourceEquipment';
import ResourcePanel from './ResourcePanel';
import iconAccessibilityError from '../../../assets/icons/accessibility-error.svg';
import iconAccessibilityOk from '../../../assets/icons/accessibility-ok.svg';

function ResourceInfo({
  isLoggedIn,
  resource,
  unit,
  t,
  accessibilityInformation,
}) {
  const serviceMapUrl = getServiceMapUrl(unit);
  const hasProducts = resource.products && resource.products.length > 0;
  const nAccessibilityShortcomings = accessibilityInformation
    ? accessibilityInformation.shortcomings.reduce(
      (acc, shortcoming) => acc + shortcoming.sentences.length,
      0,
    )
    : 0;

  return (
    <section className="app-ResourceInfo">
      {resource.description && (
        <ResourcePanel header={t('ResourceInfo.descriptionTitle')}>
          <div className="app-ResourceInfo__description">
            <WrappedText openLinksInNewTab text={resource.description} />
          </div>
        </ResourcePanel>
      )}

      {resource.specificTerms && (
        <ResourcePanel header={t('ResourcePage.specificTerms')}>
          <WrappedText text={resource.specificTerms} />
        </ResourcePanel>
      )}

      {resource.genericTerms && (
        <ResourcePanel
          defaultExpanded={false}
          header={t('ResourcePage.genericTermsHeader')}
        >
          <WrappedText text={resource.genericTerms} />
        </ResourcePanel>
      )}

      {hasProducts && resource.paymentTerms && (
        <ResourcePanel defaultExpanded={false} header={t('paymentTerms.title')}>
          <WrappedText text={resource.paymentTerms} />
        </ResourcePanel>
      )}

      <ResourcePanel header={t('ResourceInfo.additionalInfoTitle')}>
        <Row>
          <Col className="app-ResourceInfo__address" xs={6}>
            {unit && unit.name && <span>{unit.name}</span>}
            {unit && unit.streetAddress && <span>{unit.streetAddress}</span>}
            {unit && (
              <span>
                {`${unit.addressZip} ${upperFirst(unit.municipality)}`.trim()}
              </span>
            )}
          </Col>
          <Col className="app-ResourceInfo__web" xs={6}>
            {serviceMapUrl && (
              <span className="app-ResourceInfo__servicemap">
                <a
                  href={serviceMapUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {t('ResourceInfo.serviceMapLink')}
                </a>
              </span>
            )}
            {unit && unit.wwwUrl && (
              <span className="app-ResourceInfo__www">
                <a href={unit.wwwUrl} rel="noopener noreferrer" target="_blank">
                  {t('ResourceInfo.serviceWebLink')}
                </a>
              </span>
            )}
          </Col>
        </Row>
      </ResourcePanel>

      {Array.isArray(resource.equipment) && resource.equipment.length > 0 && (
        <Equipment equipment={resource.equipment} />
      )}

      <ResourcePanel header={t('ResourceInfo.reservationTitle')}>
        <ReservationInfo isLoggedIn={isLoggedIn} resource={resource} />
      </ResourcePanel>

      {accessibilityInformation && (
        <ResourcePanel
          className="app-ResourceInfo__accessibility-resource-panel"
          componentClass="div"
          defaultExpanded={false}
          header={(
            <div className="app-ResourceInfo__accessibility-resource-panel__title-container">
              <h3>{t('ResourceInfo.accessibilityTitle')}</h3>
              <div className="app-ResourceInfo__accessibility-resource-panel__title-container__shortcomings">
                <img
                  alt=""
                  className="app-ResourceInfo__accessibility__icon"
                  src={
                    nAccessibilityShortcomings === 0
                      ? iconAccessibilityOk
                      : iconAccessibilityError
                  }
                />
                {nAccessibilityShortcomings === 0
                  ? t('ResourceInfo.noAccessibilityShortcomings')
                  : t('ResourceInfo.foundAccessibilityShortcomings', {
                    nShortcomings:
                    nAccessibilityShortcomings,
                  })}
              </div>
            </div>
)}
        >
          <div className="app-ResourceInfo__accessibility">
            {accessibilityInformation.details.length > 0 && (
              <div>
                <h4>{t('ResourceInfo.accessibilityDetailsTitle')}</h4>
                {accessibilityInformation.details.map(
                  (sentenceGroup, sentenceGroupId) => (
                    <React.Fragment
                      key={`accessibility-sentence-group-${sentenceGroupId}`}
                    >
                      <b>{sentenceGroup.sentenceGroup}</b>
                      <ul>
                        {sentenceGroup.sentences.map((sentence, sentenceId) => (
                          <li key={`sentence-${sentenceId}`}>{sentence}</li>
                        ))}
                      </ul>
                    </React.Fragment>
                  ),
                )}
              </div>
            )}

            {accessibilityInformation.shortcomings.length > 0 && (
              <div>
                <h4>{t('ResourceInfo.accessibilityShortcomingsTitle')}</h4>
                {accessibilityInformation.shortcomings.map(
                  (sentenceGroup, sentenceGroupId) => (
                    <React.Fragment
                      key={`accessibility-sentence-group-${sentenceGroupId}`}
                    >
                      <div className="app-ResourceInfo__accessibility__shortcoming-sentence-group">
                        <img
                          alt="accessibility-shortcoming"
                          className="app-ResourceInfo__accessibility__icon"
                          src={iconAccessibilityError}
                        />
                        <b>{sentenceGroup.sentenceGroup}</b>
                      </div>
                      <ul
                        key={`accessibility-sentence-group-${sentenceGroupId}`}
                      >
                        {sentenceGroup.sentences.map((sentence, sentenceId) => (
                          <li key={`sentence-${sentenceId}`}>{sentence}</li>
                        ))}
                      </ul>
                    </React.Fragment>
                  ),
                )}
              </div>
            )}
          </div>
        </ResourcePanel>
      )}
    </section>
  );
}

ResourceInfo.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
  accessibilityInformation: PropTypes.exact({
    details: PropTypes.arrayOf(
      PropTypes.exact({
        sentenceGroup: PropTypes.string,
        sentences: PropTypes.arrayOf(PropTypes.string),
      }),
    ),
    shortcomings: PropTypes.arrayOf(
      PropTypes.exact({
        sentenceGroup: PropTypes.string,
        sentences: PropTypes.arrayOf(PropTypes.string),
      }),
    ),
  }),
};

ResourceInfo = injectT(ResourceInfo); // eslint-disable-line

export default ResourceInfo;
