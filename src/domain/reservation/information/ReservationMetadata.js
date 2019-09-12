import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';

import { RESERVATION_METADATA } from '../constants';
import injectT from '../../../../app/i18n/injectT';

const ReservationMetadata = ({ t, reservation, customField }) => {
  const renderMetaDataField = (fieldName) => {
    const value = get(reservation, fieldName, null);

    return (
      value ? (
        <Row
          className="app-ReservationMetadata__field"
          key={`reservation-metadata-field-${fieldName}`}
        >
          <Col xs={6}>
            <b>{t(`common.${camelCase(fieldName)}Label`)}</b>
          </Col>
          <Col className="app-ReservationConfirmation__field-value" xs={6}>
            {value}
          </Col>
        </Row>
      ) : ''
    );
  };

  return (
    <div className="app-ReservationMetadata">
      {RESERVATION_METADATA.map(metadataFieldName => (customField || renderMetaDataField(metadataFieldName)))}
    </div>
  );
};

ReservationMetadata.propTypes = {
  customField: PropTypes.func,
  t: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired
};

export default injectT(ReservationMetadata);
