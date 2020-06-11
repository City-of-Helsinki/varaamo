import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';

import injectT from '../../i18n/injectT';
import { hasProducts } from '../../utils/resourceUtils';
import {
  getUnitRoleFromResource,
  getIsUnitStaff,
} from '../../../src/domain/resource/permissions/utils';

class ReservationControls extends Component {
  get buttons() {
    return {
      cancel: (
        <Button
          bsStyle="danger"
          key="cancelButton"
          onClick={this.props.onCancelClick}
        >
          {this.props.t('ReservationControls.cancel')}
        </Button>
      ),
      confirm: (
        <Button
          bsStyle="success"
          key="confirmButton"
          onClick={this.props.onConfirmClick}
        >
          {this.props.t('ReservationControls.confirm')}
        </Button>
      ),
      deny: (
        <Button
          bsStyle="danger"
          key="denyButton"
          onClick={this.props.onDenyClick}
        >
          {this.props.t('ReservationControls.deny')}
        </Button>
      ),
      edit: (
        <Button
          bsStyle="primary"
          disabled={
            (!this.isStaff &&
              !this.props.isAdmin &&
              hasProducts(this.props.resource)) ||
            this.props.resource === null
          }
          key="editButton"
          onClick={this.props.onEditClick}
        >
          {this.props.t('ReservationControls.edit')}
        </Button>
      ),
      info: (
        <Button
          bsStyle="default"
          key="infoButton"
          onClick={this.props.onInfoClick}
        >
          {this.props.t('ReservationControls.info')}
        </Button>
      ),
    };
  }

  get isStaff() {
    const { resource } = this.props;

    if (!resource) {
      return false;
    }

    return getIsUnitStaff(getUnitRoleFromResource(resource));
  }

  renderButtons(buttons, isAdmin, isStaff, reservation) {
    if (!reservation.need_manual_confirmation) {
      if (reservation.state === 'cancelled') {
        return null;
      }
      return isAdmin
        ? [buttons.edit, buttons.cancel]
        : [buttons.edit, buttons.cancel];
    }

    switch (reservation.state) {
      case 'cancelled': {
        return [];
      }

      case 'confirmed': {
        if (isAdmin) {
          return isStaff ? [buttons.cancel, buttons.edit] : [buttons.cancel];
        }
        return [buttons.cancel];
      }

      case 'denied': {
        return [];
      }

      case 'requested': {
        if (isAdmin) {
          return isStaff
            ? [buttons.confirm, buttons.deny, buttons.edit]
            : [buttons.edit];
        }
        return [buttons.edit, buttons.cancel];
      }

      default: {
        return null;
      }
    }
  }

  render() {
    const { isAdmin, reservation } = this.props;
    const reservationIsInThePast =
      !reservation || moment() > moment(reservation.end);

    return (
      <div className="buttons">
        <div className="app-ReservationControls__info-button-wrapper">
          {this.buttons.info}
        </div>
        {!reservationIsInThePast &&
          this.renderButtons(this.buttons, isAdmin, this.isStaff, reservation)}
      </div>
    );
  }
}

ReservationControls.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  onDenyClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onInfoClick: PropTypes.func.isRequired,
  reservation: PropTypes.object,
  resource: PropTypes.object,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationControls);
