import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Overlay from 'react-bootstrap/lib/Overlay';
import moment from 'moment';

import { injectT } from 'i18n';
import iconCalendar from 'assets/icons/calendar.svg';
import ResourceCalendarOverlay from './ResourceCalendarOverlay';
import resourceCalendarSelector from './resourceCalendarSelector';

export class UnconnectedResourceCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.calendarWrapper = null;
    this.now = moment();
  }

  setCalendarWrapper = (element) => {
    this.calendarWrapper = element;
  }

  disableDays = (day) => {
    if (this.props.disableDays) {
      return this.props.disableDays(day);
    }
    return this.now.isAfter(day, 'day');
  }

  handleDateChange = (newDate) => {
    this.hideOverlay();
    this.props.onDateChange(newDate);
  }

  hideOverlay = () => {
    this.setState({ visible: false });
  }

  showOverlay = () => {
    this.setState({ visible: true });
  }

  render() {
    const {
      availability,
      currentLanguage,
      selectedDate,
      t,
    } = this.props;
    const [year, month, dayNumber] = selectedDate.split('-');
    const selectedDay = new Date();
    selectedDay.setFullYear(year, month - 1, dayNumber);
    const selectedDateText = moment(selectedDate).format('dddd D. MMMM YYYY');
    const modifiers = {
      available: (day) => {
        const dayDate = day.toISOString().substring(0, 10);
        return availability[dayDate] && availability[dayDate].percentage >= 80;
      },
      busy: (day) => {
        const dayDate = day.toISOString().substring(0, 10);
        return (
          availability[dayDate] &&
          availability[dayDate].percentage < 80 &&
          availability[dayDate].percentage > 0
        );
      },
      booked: (day) => {
        const dayDate = day.toISOString().substring(0, 10);
        return availability[dayDate] && availability[dayDate].percentage === 0;
      },
    };

    return (
      <div className="app-ResourceCalendar">
        <button
          className="app-ResourceCalendar__week-button app-ResourceCalendar__week-button--prev"
          onClick={() => this.handleDateChange(
            moment(selectedDay).subtract(1, 'w').toDate()
          )}
          type="button"
        />
        <div className="app-ResourceCalendar__wrapper" ref={this.setCalendarWrapper}>
          <FormGroup onClick={this.showOverlay}>
            <InputGroup>
              <InputGroup.Addon>
                <img alt="" className="app-ResourceCalendar__icon" src={iconCalendar} />
              </InputGroup.Addon>
              <FormControl disabled type="text" value={selectedDateText} />
              <InputGroup.Addon>
                <Glyphicon glyph="triangle-bottom" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          <Overlay
            container={this.calendarWrapper}
            onHide={this.hideOverlay}
            placement="bottom"
            rootClose
            show={this.state.visible}
          >
            <ResourceCalendarOverlay onHide={this.hideOverlay}>
              <DayPicker
                disabledDays={this.disableDays}
                enableOutsideDays
                initialMonth={new Date(selectedDate)}
                locale={currentLanguage}
                localeUtils={MomentLocaleUtils}
                modifiers={modifiers}
                onDayClick={this.handleDateChange}
                selectedDays={selectedDay}
              />
              <div className="calendar-legend">
                <span className="free">{t('ReservationCalendarPickerLegend.free')}</span>
                <span className="busy">{t('ReservationCalendarPickerLegend.busy')}</span>
                <span className="booked">{t('ReservationCalendarPickerLegend.booked')}</span>
              </div>
            </ResourceCalendarOverlay>
          </Overlay>
        </div>
        <button
          className="app-ResourceCalendar__week-button app-ResourceCalendar__week-button--next"
          onClick={() => this.handleDateChange(
            moment(selectedDay).add(1, 'w').toDate()
          )}
          type="button"
        />
      </div>
    );
  }
}

UnconnectedResourceCalendar.propTypes = {
  availability: PropTypes.object.isRequired,
  disableDays: PropTypes.func,
  currentLanguage: PropTypes.string.isRequired,
  selectedDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};
UnconnectedResourceCalendar = injectT(UnconnectedResourceCalendar) // eslint-disable-line

export default connect(resourceCalendarSelector)(UnconnectedResourceCalendar);
