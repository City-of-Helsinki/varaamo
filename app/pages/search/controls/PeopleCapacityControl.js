import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FontAwesome from 'react-fontawesome';
import NumericInput from 'react-numeric-input';

import { injectT } from 'i18n';
import MiniModal from 'shared/mini-modal';

class PeopleCapacityControl extends React.Component {
  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.number,
  };

  state = {
    value: 0,
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
      <div className="app-PeopleCapacityControl">
        <MiniModal
          buttonContent={
            <div>
              <div><FontAwesome name="users" /> Henkilömäärä</div>
              <div>{value || '1'}</div>
            </div>
          }
          header={t('PeopleCapacityControl.header')}
          onConfirm={this.handleConfirm}
          theme="orange"
        >
          <FormGroup controlId="people-capacity-control-group">
            <ControlLabel>
              {t('PeopleCapacityControl.label')}
            </ControlLabel>
            <NumericInput
              className="form-control"
              min={1}
              onChange={this.handleChange}
              value={this.state.value || 1}
            />
          </FormGroup>
        </MiniModal>
      </div>
    );
  }
}

export default injectT(PeopleCapacityControl);
