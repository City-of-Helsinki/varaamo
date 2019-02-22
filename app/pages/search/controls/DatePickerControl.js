import PropTypes from 'prop-types';
import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Overlay from 'react-bootstrap/lib/Overlay';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';

import { injectT } from 'i18n';
import SearchControlOverlay from './SearchControlOverlay';
import iconCalendar from './images/calendar.svg';

class DatePickerControl extends React.Component {
  static propTypes = {
    currentLanguage: PropTypes.string.isRequired,
    date: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { date } = this.props;
    this.state = {
      date,
      visible: false,
    };
  }

  componentWillUpdate(nextProps) {
    const { date } = nextProps;
    if (date !== this.props.date) {
      // eslint-disable-next-line react/no-will-update-set-state
      this.setState({ date });
    }
  }

  hideOverlay = () => {
    this.setState({ visible: false });
  };

  showOverlay = () => {
    this.setState({ visible: true });
  };

  handleConfirm = (value) => {
    const date = moment(value);
    this.props.onConfirm({ date });
    this.hideOverlay();
  };

  render() {
    const { currentLanguage, t } = this.props;
    const { date } = this.state;
    const selectedDay = moment(date, 'L')
      .startOf('day')
      .toDate();

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
          <SearchControlOverlay onHide={this.hideOverlay} title={t('DatePickerControl.header')}>
            <DayPicker
              disabledDays={day => new Date(day).setHours(23, 59, 59, 59) < new Date()}
              enableOutsideDays
              initialMonth={selectedDay}
              locale={currentLanguage}
              localeUtils={MomentLocaleUtils}
              onDayClick={this.handleConfirm}
              selectedDays={selectedDay}
              showOutsideDays
              showWeekNumbers
            />
          </SearchControlOverlay>
        </Overlay>
      </div>
    );
  }
}

export default injectT(DatePickerControl);
