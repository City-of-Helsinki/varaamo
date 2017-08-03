import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';

import { injectT } from 'i18n';

class PurposeControl extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    purposeOptions: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  state = {
    visible: false,
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
    const { isLoading, purposeOptions, t, value } = this.props;
    const selectOptions = [
      {
        label: t('common.optionsAllLabel'),
        value: '',
      },
      ...purposeOptions,
    ];
    const originalOption = selectOptions.find(option => option.value === this.props.value) || {};

    return (
      <div className="app-PurposeControl">
        <Button
          className="app-PurposeControl__show-button"
          onClick={this.showModal}
        >
          <div><FontAwesome name="bullseye" /> {t('PurposeControl.buttonLabel')}</div>
          <div>{originalOption.label}</div>
        </Button>
        <Modal
          dialogClassName="app-PurposeControl__modal"
          onHide={this.hideModal}
          show={this.state.visible}
        >
          <div className="app-PurposeControl__modal-header">
            <h2>{t('PurposeControl.label')}</h2>
          </div>
          <div className="app-PurposeControl__modal-content">
            <Select
              clearable={false}
              isLoading={isLoading}
              name="purpose-filter-select"
              onChange={this.handleConfirm}
              options={selectOptions}
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

export default injectT(PurposeControl);
