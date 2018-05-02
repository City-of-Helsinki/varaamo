import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Overlay from 'react-bootstrap/lib/Overlay';
import { Calendar } from 'react-date-picker';

import { injectT } from 'i18n';
import SearchControlOverlay from './SearchControlOverlay';
import iconCalendar from './images/calendar.svg';

class DatePickerControl extends React.Component {
  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  state = {
    visible: false,
  }

  hideOverlay = () => {
    this.setState({ visible: false });
  }

  showOverlay = () => {
    this.setState({ visible: true });
  }

  handleConfirm = (value) => {
    this.props.onConfirm(value);
    this.hideOverlay();
  }

  render() {
    const { t, value } = this.props;
    return (
      <div className="app-DatePickerControl">
        <ControlLabel>{t('DatePickerControl.label')}</ControlLabel>
        <FormGroup onClick={this.showOverlay}>
          <InputGroup>
            <InputGroup.Addon>
              <img alt="" className="app-DatePickerControl__icon" src={iconCalendar} />
            </InputGroup.Addon>
            <FormControl disabled type="text" value={value} />
            <InputGroup.Addon>
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
            <Calendar
              className="app-DatePickerControl__calendar"
              dateFormat={'L'}
              defaultDate={value}
              onChange={this.handleConfirm}
            />
          </SearchControlOverlay>
        </Overlay>
      </div>
    );
  }
}

export default injectT(DatePickerControl);
