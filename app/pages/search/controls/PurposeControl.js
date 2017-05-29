import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';

import { injectT } from 'i18n';
import MiniModal from 'shared/mini-modal';

class PurposeControl extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    purposeOptions: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  handleChange = (option) => {
    this.props.onChange({ purpose: option ? option.value : '' });
  }

  render() {
    const { isLoading, purposeOptions, t, value } = this.props;
    const selectedOption = purposeOptions.find(option => option.value === value);
    const selectValue = selectedOption ? value : undefined;
    const humanizedValue = selectedOption ? selectedOption.label : '';

    return (
      <div className="app-PurposeControl">
        <MiniModal
          buttonContent={
            <span><FontAwesome name="bullseye" /> {humanizedValue}</span>
          }
          header={t('PurposeControl.header')}
          theme="blue"
        >
          <FormGroup controlId="people-capacity-control-group">
            <ControlLabel>
              {t('PurposeControl.label')}
            </ControlLabel>
            <Select
              clearable
              isLoading={isLoading}
              name="purpose-filter-select"
              onChange={this.handleChange}
              options={purposeOptions}
              placeholder=" "
              searchable={false}
              value={selectValue}
            />
          </FormGroup>
        </MiniModal>
      </div>
    );
  }
}

export default injectT(PurposeControl);
