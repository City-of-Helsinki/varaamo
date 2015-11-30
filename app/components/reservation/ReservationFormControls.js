import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

class ReservationFormControls extends Component {
  constructor(props) {
    super(props);
    this.handleMainClick = this.handleMainClick.bind(this);
  }

  getButtonText(isEditing, isMakingReservations) {
    if (isEditing) {
      return isMakingReservations ? 'Tallennetaan...' : 'Vahvista muutokset';
    }
    return isMakingReservations ? 'Varataan...' : 'Varaa';
  }

  handleMainClick() {
    const {
      addNotification,
      canMakeReservations,
      disabled,
      onClick,
    } = this.props;

    if (disabled) {
      let message;
      if (canMakeReservations) {
        message = 'Valitse aika, jolle haluat tehdä varauksen.';
      } else {
        message = `
          Lorem ipsum dolor sit amet, id odio ludus torquatos per, eripuit apeirian deseruisse eos no.
          Mel ex aeque oporteat, sit nobis homero sensibus ea. Te eam porro atomorum philosophia.
          Invenire referrentur ei vim. Sed mollis ponderum ullamcorper ea, sit aliquid deseruisse
          incorrupte id, et qui probo consequat constituto.
        `;
      }
      const notification = {
        message: message,
        type: 'info',
        timeOut: 10000,
      };
      addNotification(notification);
    } else {
      onClick();
    }
  }

  render() {
    const {
      disabled,
      isEditing,
      isMakingReservations,
      onCancel,
    } = this.props;

    return (
      <div>
        <ButtonGroup style={{ width: '100%' }}>
          <Button
            bsStyle="primary"
            className={classNames({ disabled })}
            onClick={this.handleMainClick}
            style={{ width: isEditing ? '50%' : '100%' }}
          >
            {this.getButtonText(isEditing, isMakingReservations)}
          </Button>
          {isEditing && (
            <Button
              bsStyle="default"
              onClick={onCancel}
              style={{ width: '50%' }}
            >
              Peruuta
            </Button>
          )}
        </ButtonGroup>
      </div>
    );
  }
}

ReservationFormControls.propTypes = {
  addNotification: PropTypes.func.isRequired,
  canMakeReservations: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ReservationFormControls;
