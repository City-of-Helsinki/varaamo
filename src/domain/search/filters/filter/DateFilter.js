import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Overlay from 'react-bootstrap/lib/Overlay';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';

import constants from '../../../../../app/constants/AppConstants';
import injectT from '../../../../../app/i18n/injectT';
import iconCalendar from './images/calendar.svg';

const DatePickerWrapper = ({ children }) => (
  <div className="app-DateFilter__datePicker">{children}</div>
);

function formatDate(date) {
  return moment(date).format('L');
}

DatePickerWrapper.propTypes = {
  children: PropTypes.any,
};

class UntranslatedDateFilter extends React.Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date),
    locale: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      inputValue: formatDate(this.props.date),
      inputTouched: false,
    };
  }

  componentDidUpdate(prevProps) {
    const currentDate = moment(this.props.date).format(constants.DATE_FORMAT);
    const previousDate = moment(prevProps.date).format(constants.DATE_FORMAT);

    // Moving the logic for keeping the input date value up to date
    // higher up in the hierarchy would make the usage of this component
    // too cumbersome. Hence we are using an ugly hack here that allows
    // us to use a sort of cached value for the input.
    if (currentDate !== previousDate) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        inputValue: formatDate(this.props.date),
      });
    }
  }

  handleInputKeydown = (event) => {
    switch (event.key) {
      case 'Enter':
        this.setState({ inputTouched: true });

        const inputDateIsValid = this.isValidDate(this.state.inputValue);
        const propsDateIsValid = this.isValidDate(this.props.date);

        if (!inputDateIsValid || !propsDateIsValid) {
          break;
        }

        const formattedInputDate = moment(
          this.state.inputValue,
          'L',
          true
        ).format(constants.DATE_FORMAT);
        const formattedPropsDate = moment(this.props.date).format(
          constants.DATE_FORMAT
        );

        if (formattedInputDate === formattedPropsDate) {
          this.setState({ isOpen: false });
        }

        break;
      default:
        break;
    }
  };

  onChange = (newDate) => {
    const { onChange } = this.props;

    this.setState({
      isOpen: false,
      inputValue: moment(newDate).format('L'),
    });

    onChange(newDate);
  };

  isValidDate = (date, format = 'L') => {
    return moment(date, format, true).isValid();
  };

  handleInputChange = (event) => {
    const { value } = event.target;

    this.setState({ inputValue: value });

    if (value && this.isValidDate(value)) {
      this.props.onChange(moment(value, 'L', true));
    }
  };

  handleInputBlur = () => {
    this.setState({ inputTouched: true });
  };

  handleDateButtonClick = () => {
    this.setState((state) => ({ isOpen: !state.isOpen }));
  };

  render() {
    const { locale, label, date, name, t } = this.props;
    const { isOpen, inputValue, inputTouched } = this.state;
    const inputError = inputTouched && !this.isValidDate(inputValue);
    const errorMessageId = `${name}-error`;

    return (
      <div className="app-DateFilter">
        <FormGroup controlId={name}>
          <ControlLabel>{label}</ControlLabel>
          {/* Apply error here so that it doesn't end up under the overlay */}
          {inputError && (
            <span
              className="app-DateFilter__calendar_error"
              id={errorMessageId}
              role="alert"
            >
              {t('DatePickerControl.form.error.feedback')}
            </span>
          )}
          <InputGroup>
            <FormControl
              aria-describedby={errorMessageId}
              className="app-DateFilter__input"
              onBlur={this.handleInputBlur}
              onChange={this.handleInputChange}
              onClick={() => this.setState({ isOpen: !isOpen })}
              onKeyDown={this.handleInputKeydown}
              type="text"
              value={inputValue}
            />
            <InputGroup.Button>
              {/* We are setting tab-index as -1 in order to skip */}
              {/* the button controlling the date picker dropdown. */}
              {/* Because it's not keyboard accessible, it's better */}
              {/* to help users avoid it */}
              <Button
                aria-hidden="true"
                className="app-DatePickerControl__button"
                onClick={this.handleDateButtonClick}
                tabIndex={-1}
              >
                {/* This image is hidden from screen readers so the */}
                {/* alt text is here to help seeing mouse using */}
                {/* users */}
                <img
                  alt={t('DatePickerControl.button.imageAlt')}
                  className="app-DateFilter__icon"
                  src={iconCalendar}
                />
              </Button>
            </InputGroup.Button>
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
              disabledDays={(day) => moment(day).isBefore(moment(), 'date')}
              initialMonth={date}
              locale={locale}
              localeUtils={MomentLocaleUtils}
              onDayClick={(newDate) => this.onChange(newDate)}
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
export { UntranslatedDateFilter };
export default injectT(UntranslatedDateFilter);
