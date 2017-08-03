import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { Calendar } from 'react-date-picker';
import FontAwesome from 'react-fontawesome';

import { injectT } from 'i18n';

class DatePickerControl extends React.Component {
  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  state = {
    visible: false,
  }

  hideModal = () => {
    this.setState({ visible: false });
  }

  showModal = () => {
    this.setState({ visible: true });
  }

  handleConfirm = (value) => {
    this.props.onConfirm(value);
    this.hideModal();
  }

  render() {
    const { t, value } = this.props;
    return (
      <div className="app-DatePickerControl">
        <Button
          className="app-DatePickerControl__show-button"
          onClick={this.showModal}
        >
          <div><FontAwesome name="calendar" /> {t('DatePickerControl.buttonLabel')}</div>
          <div>{value || ''}</div>
        </Button>
        <Modal
          dialogClassName="app-DatePickerControl__modal"
          onHide={this.hideModal}
          show={this.state.visible}
        >
          <div className="app-DatePickerControl__modal-header">
            <h2>{t('DatePickerControl.header')}</h2>
          </div>
          <div className="app-DatePickerControl__modal-content">
            <Calendar
              className="app-DatePickerControl__calendar"
              dateFormat={'L'}
              defaultDate={value}
              onChange={this.handleConfirm}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default injectT(DatePickerControl);
