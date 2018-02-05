import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Overlay from 'react-bootstrap/lib/Overlay';
import { Calendar } from 'react-date-picker';
import FontAwesome from 'react-fontawesome';

import { injectT } from 'i18n';
import SearchControlOverlay from './SearchControlOverlay';

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
        <Button
          className="app-DatePickerControl__show-button"
          onClick={this.showOverlay}
        >
          <div><FontAwesome name="calendar" /> {t('DatePickerControl.buttonLabel')}</div>
          <div>{value || ''}</div>
        </Button>
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
