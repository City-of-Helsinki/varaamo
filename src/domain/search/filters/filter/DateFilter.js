import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Overlay from 'react-bootstrap/lib/Overlay';

import injectT from '../../../../../app/i18n/injectT';
import iconCalendar from './images/calendar.svg';

const DatePickerWrapper = ({ children }) => (
  <div className="app-DateFilter__datePicker">
    {children}
  </div>
);

DatePickerWrapper.propTypes = {
  children: PropTypes.any,
};

class DateFilter extends React.Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date),
    locale: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  onChange = (newDate) => {
    const { onChange } = this.props;

    this.setState({
      isOpen: false,
    });

    onChange(newDate);
  };

  render() {
    const {
      locale,
      label,
      date,
    } = this.props;
    const { isOpen } = this.state;

    return (
      <div className="app-DateFilter">
        <ControlLabel>{label}</ControlLabel>
        <FormGroup onClick={() => this.setState({ isOpen: !isOpen })}>
          <InputGroup>
            <InputGroup.Addon className="app-DateFilter__title">
              <img alt="" className="app-DateFilter__icon" src={iconCalendar} />
              <span>{moment(date).format('L')}</span>
            </InputGroup.Addon>
            <InputGroup.Addon className="app-DateFilter__triangle">
              <Glyphicon glyph="triangle-bottom" />
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <Overlay
          animation={false}
          container={this}
          onHide={() => this.setState({ isOpen: false })}
          placement="bottom"
          rootClose
          show={isOpen}
        >
          <DatePickerWrapper>
            <DayPicker
              disabledDays={day => moment(day).isBefore(moment(), 'date')}
              initialMonth={date}
              locale={locale}
              localeUtils={MomentLocaleUtils}
              onDayClick={newDate => this.onChange(newDate)}
              selectedDays={date}
              showOutsideDays
              showWeekNumbers
            />
          </DatePickerWrapper>
        </Overlay>
      </div>
    );
  }
}
export { DateFilter };
export default injectT(DateFilter);
