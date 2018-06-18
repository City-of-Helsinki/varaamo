import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Overlay from 'react-bootstrap/lib/Overlay';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';

import { injectT } from 'i18n';
import {
  calculateDuration,
  calculateEndTime,
} from 'utils/timeUtils';
import SearchControlOverlay from './SearchControlOverlay';
import iconCalendar from './images/calendar.svg';

class DatePickerControl extends React.Component {
  static propTypes = {
    currentLanguage: PropTypes.string.isRequired,
    date: PropTypes.string,
    duration: PropTypes.number,
    end: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    start: PropTypes.string,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { date, duration, end, start } = this.props;
    this.state = {
      date,
      duration,
      end,
      start,
      visible: false,
    };
  }

  componentWillUpdate(nextProps) {
    const { date, duration, end, start } = nextProps;
    if (date !== this.props.date || duration !== this.props.duration ||
      end !== this.props.end || start !== this.props.start) {
      this.setState({ date, duration, end, start });
    }
  }

  hideOverlay = () => {
    this.setState({ visible: false });
  }

  showOverlay = () => {
    this.setState({ visible: true });
  }

  handleConfirm = (value) => {
    const { duration, end, start } = this.state;
    const date = value;
    this.props.onConfirm({ date, duration, end, start });
    this.hideOverlay();
  }

  handleTimeRange = ({ duration, end, start }) => {
    const { date } = this.state;
    const endValue = calculateEndTime(end, start);
    const durationValue = calculateDuration(duration, start, endValue);
    this.setState({ duration: durationValue, start, end: endValue, visible: false });
    this.props.onConfirm({ date, duration: durationValue, end: endValue, start });
  }

  render() {
    const { currentLanguage, t } = this.props;
    const { date } = this.state;
    const selectedDay = moment(date, 'L').startOf('day').toDate();

    return (
      <div className="app-DatePickerControl">
        <ControlLabel>{t('DatePickerControl.label')}</ControlLabel>
        <FormGroup onClick={this.showOverlay}>
          <InputGroup>
            <InputGroup.Addon className="app-DatePickerControl__title">
              <img alt="" className="app-DatePickerControl__icon" src={iconCalendar} />
              <span>{date}</span>
            </InputGroup.Addon>
            <InputGroup.Addon className="app-DatePickerControl__triangle">
              <Glyphicon glyph="triangle-bottom" />
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <Overlay
          container={this}
          onHide={this.hideOverlay}
          placement="bottom"
          rootClose
          show={this.state.visible}
        >
          <SearchControlOverlay
            onHide={this.hideOverlay}
            title={t('DatePickerControl.header')}
          >
            <DayPicker
              disabledDays={day => new Date(day).setHours(23, 59, 59, 59) < new Date()}
              enableOutsideDays
              initialMonth={selectedDay}
              locale={currentLanguage}
              localeUtils={MomentLocaleUtils}
              onDayClick={this.handleConfirm}
              selectedDays={selectedDay}
              showWeekNumbers
            />
          </SearchControlOverlay>
        </Overlay>
      </div>
    );
  }
}

export default injectT(DatePickerControl);
