import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Overlay from 'react-bootstrap/lib/Overlay';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';

import { currentLanguageSelector } from '../../../../../app/state/selectors/translationSelectors';
import iconCalendar from './images/calendar.svg';

class DateFilter extends React.Component {
  static propTypes = {
    currentLanguage: PropTypes.string.isRequired, // TODO: Get this straight from redux.
    date: PropTypes.instanceOf(Date),
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

    // this.setState({
    //   isOpen: false,
    // });

    onChange(newDate);
  };

  render() {
    const {
      currentLanguage,
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
          <div className="app-DateFilter__datePicker">
            <DayPicker
              disabledDays={day => moment(day).isBefore(moment(), 'date')}
              locale={currentLanguage}
              localeUtils={MomentLocaleUtils}
              onDayClick={newDate => this.onChange(newDate)}
              selectedDays={date}
              showOutsideDays
              showWeekNumbers
            />
          </div>
        </Overlay>
      </div>
    );
  }
}

const selector = createStructuredSelector({
  currentLanguage: currentLanguageSelector,
});

export default connect(selector)(DateFilter);
