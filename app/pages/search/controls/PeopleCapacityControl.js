import range from 'lodash/range';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';

import { injectT } from 'i18n';

class PeopleCapacityControl extends React.Component {
  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.number,
  };

  state = {
    visible: false,
  }

  getOption(value) {
    return { label: String(value), value };
  }

  hideModal = () => {
    this.setState({ visible: false });
  }

  showModal = () => {
    this.setState({ visible: true });
  }

  handleConfirm = (option) => {
    const value = option ? option.value : '';
    this.props.onConfirm(value);
    this.hideModal();
  }

  render() {
    const { t, value } = this.props;
    const options = range(1, 10).map(this.getOption);
    range(10, 30, 5).forEach(index => options.push(this.getOption(index)));
    options.push({ label: '30+', value: 30 });
    return (
      <div className="app-PeopleCapacityControl">
        <Button
          className="app-PeopleCapacityControl__show-button"
          onClick={this.showModal}
        >
          <div><FontAwesome name="users" /> {t('PeopleCapacityControl.buttonLabel')}</div>
          <div>{value || '1'}</div>
        </Button>
        <Modal
          dialogClassName="app-PeopleCapacityControl__modal"
          onHide={this.hideModal}
          show={this.state.visible}
        >
          <div className="app-PeopleCapacityControl__modal-header">
            <h2>{t('PeopleCapacityControl.header')}</h2>
          </div>
          <div className="app-PeopleCapacityControl__modal-content">
            <Select
              clearable={false}
              name="purpose-filter-select"
              onChange={this.handleConfirm}
              options={options}
              placeholder=" "
              searchable={false}
              value={value}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default injectT(PeopleCapacityControl);
