import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Overlay from 'react-bootstrap/lib/Overlay';

import { getDateWithinTZ } from '../../../../app/utils/timeUtils';
import iconCalendar from './images/calendar.svg';

const DatePickerWrapper = ({ children }) => (
  <div className="app-DateField__datePicker">
    {children}
  </div>
);

DatePickerWrapper.propTypes = {
  children: PropTypes.any,
};

class DateFilter extends React.Component {
  static propTypes = {
    value: PropTypes.instanceOf(Date),
    intl: intlShape.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
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
      intl,
      label,
      placeholder,
      value,
    } = this.props;
    const { isOpen } = this.state;
    const date = getDateWithinTZ(value);

    return (
      <div className="app-DateField">
        <FormGroup onClick={() => this.setState({ isOpen: !isOpen })}>
          {label && <ControlLabel className="app-DateField__label">{label}</ControlLabel>}
          <InputGroup>
            <InputGroup.Addon className="app-DateField__input">
              <img alt="" className="app-DateField__icon" src={iconCalendar} />
              {value && <span className="value">{moment(value).format('L')}</span>}
              {(!value && placeholder) && (
                <span className="placeholder">{placeholder}</span>
              )}
            </InputGroup.Addon>
            <InputGroup.Addon className="app-DateField__triangle">
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
              initialMonth={date}
              locale={intl.locale}
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

export default injectIntl(DateFilter);
