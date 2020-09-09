import PropTypes from 'prop-types';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { decamelizeKeys, camelize } from 'humps';
import { Dropdown } from 'hds-react';

import injectT from '../../../i18n/injectT';
import ResourceCalendar from '../../../shared/resource-calendar/ResourceCalendar';
// eslint-disable-next-line max-len
import ResourceKeyboardReservation from '../../../../src/domain/resource/resourceKeyboardReservation/ResourceKeyboardReservation';
// eslint-disable-next-line max-len
import ResourceReservationCalendar from '../../../../src/domain/resource/reservationCalendar/ResourceReservationCalendar';
import { reservationLengthType } from '../../../../src/domain/resource/constants';
// eslint-disable-next-line max-len
import ResourceMultidayReservationCalendar from '../../../../src/domain/resource/resourceMultidayReservationCalendar/ResourceMultidayReservationCalendar';
// eslint-disable-next-line max-len
import ResourceReservationButton from '../../../../src/domain/resource/resourceReservationButton/ResourceReservationButton';
import DateRangeSummary from '../../../../src/common/date-range/summary/DateRangeSummary';

const ResourceReservation = ({
  date,
  resource,
  isLoggedIn,
  isStaff,
  onReserve,
  handleDateChange,
  isDayReservable,
  t,
}) => {
  const lengthTypeOptions = resource.periods
    ? resource.periods.map(period => ({
      value: period.reservationLengthType,
      label: t(
        `common.resourceLengthType.${camelize(period.reservationLengthType)}`,
      ),
    }))
    : [];

  const [selectedLengthType, setSelectedLengthType] = useState(undefined);
  const [selected, setSelected] = useState({ start: null, end: null });

  useEffect(() => {
    if (
      Array.isArray(lengthTypeOptions)
      && !lengthTypeOptions.some(
        option => selectedLengthType && option.value === selectedLengthType.value,
      )
    ) {
      setSelectedLengthType(lengthTypeOptions[0]);
    }
  }, [lengthTypeOptions, selectedLengthType]);

  return (
    <div>
      {window.innerWidth < 768 && (
        <React.Fragment>
          <div className="app-ResourcePage__content-selection-directions">
            {t('ReservationInfo.selectionStartDirections')}
          </div>
          <div className="app-ResourcePage__content-selection-directions">
            {t('ReservationInfo.selectionEditDirections')}
          </div>
        </React.Fragment>
      )}

      {lengthTypeOptions && lengthTypeOptions.length > 1 && selectedLengthType && (
        <Dropdown
          onChange={(lengthType) => {
            setSelectedLengthType(lengthType);
            setSelected({ start: null, end: null });
          }}
          options={lengthTypeOptions}
          selectedOption={selectedLengthType}
        />
      )}

      {(!selectedLengthType
        || selectedLengthType.value === reservationLengthType.WITHIN_DAY) && (
        <>
          <ResourceCalendar
            isDayReservable={isDayReservable}
            onDateChange={handleDateChange}
            resourceId={resource.id}
            selectedDate={date}
          />
          <div className="app-ResourcePage__keyboard-reservation">
            <ResourceKeyboardReservation
              onDateChange={handleDateChange}
              onTimeChange={setSelected}
              resource={resource}
              selectedDate={date}
              selectedTime={selected}
            />
            <ResourceReservationButton
              isLoggedIn={isLoggedIn}
              onReserve={onReserve}
              resource={resource}
              selected={selected}
              t={t}
            />
          </div>
          <ResourceReservationCalendar
            date={date}
            isStaff={isStaff}
            onDateChange={newDate => handleDateChange(moment(newDate).toDate())
            }
            onTimeChange={selectedTime => (selectedTime
              ? setSelected({
                start: moment(selectedTime.start).toISOString(),
                end: moment(selectedTime.end).toISOString(),
              })
              : setSelected({ start: null, end: null }))
            }
            resource={decamelizeKeys(resource)}
          />
          <ResourceReservationButton
            isLoggedIn={isLoggedIn}
            onReserve={onReserve}
            resource={resource}
            selected={selected}
            t={t}
          />
        </>
      )}

      {selectedLengthType
        && selectedLengthType.value !== reservationLengthType.WITHIN_DAY && (
          <div className="app-ResourceReservation__multiday">
            <ResourceMultidayReservationCalendar
              date={date}
              lengthType={selectedLengthType.value}
              onDateChange={handleDateChange}
              onSelectedRangeChange={range => setSelected({
                start: moment(range.from).toISOString(),
                end: moment(range.to).toISOString(),
              })
              }
              resource={resource}
            />
            <DateRangeSummary
              endDate={selected.end ? new Date(selected.end) : null}
              fullDay={
                selectedLengthType.value === reservationLengthType.WHOLE_DAY
              }
              startDate={selected.start ? new Date(selected.start) : null}
            />
            <ResourceReservationButton
              hideInfo
              isLoggedIn={isLoggedIn}
              onReserve={onReserve}
              resource={resource}
              selected={selected}
              t={t}
            />
          </div>
      )}
    </div>
  );
};

ResourceReservation.propTypes = {
  date: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onReserve: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  isDayReservable: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ResourceReservation);
