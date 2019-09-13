import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';

import { RESERVATION_METADATA } from '../constants';
import injectT from '../../../../app/i18n/injectT';

const ReservationMetadata = ({ t, reservation, customField }) => {
  const renderDefaultMetaDataField = (fieldName, value) => {
    return (
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
    );
  };

  return (
    <div className="app-ReservationMetadata">
      {RESERVATION_METADATA.map((metadataFieldName) => {
        const value = get(reservation, metadataFieldName, null);
        const fieldGenerator = customField || renderDefaultMetaDataField;

        return value && fieldGenerator(metadataFieldName, value);
      })}
    </div>
  );
};

ReservationMetadata.propTypes = {
  customField: PropTypes.func,
  t: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired
};

export default injectT(ReservationMetadata);
