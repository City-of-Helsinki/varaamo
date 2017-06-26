import React, { PropTypes } from 'react';
import { Calendar } from 'react-date-picker';
import FontAwesome from 'react-fontawesome';

import { injectT } from 'i18n';
import MiniModal from 'shared/mini-modal';

class DatePickerControl extends React.Component {
  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  state = {
    value: this.props.value,
  }

  componentWillReceiveProps({ value }) {
    if (value !== this.props.value) {
      this.setState({ value });
    }
  }

  handleChange = (value) => {
    this.setState({ value });
  }

  handleConfirm = () => {
    this.props.onConfirm(this.state.value);
  }

  render() {
    const { t, value } = this.props;
    return (
      <div className="app-DatePickerControl">
        <MiniModal
          buttonContent={
            <span><FontAwesome name="calendar" /> {value || ''}</span>
          }
          header={t('DatePickerControl.header')}
          onConfirm={this.handleConfirm}
          theme="green"
        >
          <Calendar
            className="app-DatePickerControl__calendar"
            dateFormat={'L'}
            defaultDate={this.state.value}
            onChange={this.handleChange}
          />
        </MiniModal>
      </div>
    );
  }
}

export default injectT(DatePickerControl);
