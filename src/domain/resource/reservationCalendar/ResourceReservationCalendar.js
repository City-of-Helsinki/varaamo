import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import injectT from '../../../../app/i18n/injectT';
import TimePickerCalendar from '../../../common/calendar/TimePickerCalendar';

class UntranslatedResourceReservationCalendar extends React.Component {
  calendarRef = React.createRef();

  static propTypes = {
    date: PropTypes.string,
    isStaff: PropTypes.bool,
    onDateChange: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
    onTimeChange: PropTypes.func.isRequired,
  };

  render() {
    const {
      date,
      isStaff,
      resource,
      onDateChange,
      onTimeChange,
    } = this.props;

    const canMakeReservations = get(resource, 'user_permissions.can_make_reservations', false);

    return (
      <div className="app-ResourceReservationCalendar">
        <TimePickerCalendar
          date={date}
          disabled={!canMakeReservations}
          isStaff={isStaff}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
          resource={resource}
        />
      </div>
    );
  }
}

export { UntranslatedResourceReservationCalendar };

export default injectT(UntranslatedResourceReservationCalendar);
