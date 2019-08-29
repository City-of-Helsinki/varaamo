import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Row from 'react-bootstrap/lib/Row';
import NumericInput from 'react-numeric-input';

import injectT from '../../i18n/injectT';
import DatePicker from '../date-picker/DatePicker';
import SelectControl from '../../pages/search/controls/SelectControl';
import connect from './connectRecurringReservationControls';

function RecurringReservationControls({
  changeFrequency,
  changeLastTime,
  changeNumberOfOccurrences,
  frequency,
  frequencyOptions,
  isAdmin,
  isVisible,
  numberOfOccurrences,
  lastTime,
  t,
}) {
  if (!isVisible || !isAdmin) {
    return <span />;
  }

  return (
    <div className="recurring-reservation-controls">
      <Row>
        <Col md={3} xs={12}>
          <div className="recurring-reservation-frequency-control">
            <label htmlFor="recurrence-frequency-select">
              {t('RecurringReservationControls.frequencyLabel')}
            </label>
            <SelectControl
              className="recurrence-frequency-select"
              getOptionLabel={({ label }) => t(label)}
              id="recurrence-frequency-select"
              isClearable={false}
              name="recurrence-frequency-select"
              onChange={changeFrequency}
              options={frequencyOptions}
              value={frequency}
            />
          </div>
        </Col>
        {frequency !== '' && (
          <Col md={3} xs={12}>
            <FormGroup controlId="numberOfOccurrencesGroup">
              <ControlLabel>
                {t('RecurringReservationControls.numberOfOccurrencesLabel')}
              </ControlLabel>
              <NumericInput
                className="form-control"
                min={1}
                onChange={changeNumberOfOccurrences}
                value={numberOfOccurrences}
              />
            </FormGroup>
          </Col>
        )}
        {frequency !== '' && (
          <Col md={6} xs={12}>
            <FormGroup controlId="LastTimeGroup">
              <ControlLabel>{t('RecurringReservationControls.lastTimeLabel')}</ControlLabel>
              <DatePicker
                dateFormat="D.M.YYYY"
                onChange={changeLastTime}
                value={lastTime}
              />
            </FormGroup>
          </Col>
        )}
      </Row>
    </div>
  );
}

RecurringReservationControls.propTypes = {
  changeFrequency: PropTypes.func.isRequired,
  changeLastTime: PropTypes.func.isRequired,
  changeNumberOfOccurrences: PropTypes.func.isRequired,
  frequency: PropTypes.string.isRequired,
  frequencyOptions: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  numberOfOccurrences: PropTypes.number.isRequired,
  lastTime: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export const UnconnectedRecurringReservationControls = injectT(RecurringReservationControls);
export default connect(UnconnectedRecurringReservationControls);
