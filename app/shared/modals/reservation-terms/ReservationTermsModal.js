import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeResourceTermsModal } from 'actions/uiActions';
import { injectT } from 'i18n';
import WrappedText from 'shared/wrapped-text';
import reservationTermsModalSelector from './reservationTermsModalSelector';

class UnconnectedReservationTermsModal extends Component {

  render() {
    const {
      actions,
      resource,
      show,
      t,
    } = this.props;

    const { genericTerms, name } = resource;

    return (
      <Modal
        className="app-ReservationTermsModal"
        onHide={actions.closeResourceTermsModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {t('ReservationTermsModal.resourceTermsTitle')}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
            <span>{t('ReservationTermsModal.resourceTermsSubTitle', { name })}</span>
            <span><WrappedText text={genericTerms} /></span>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="primary"
            className="pull-right"
            onClick={actions.closeResourceTermsModal}
          >
            {t('common.continue')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationTermsModal.propTypes = {
  actions: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

UnconnectedReservationTermsModal = injectT(UnconnectedReservationTermsModal);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeResourceTermsModal,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedReservationTermsModal };
export default connect(reservationTermsModalSelector, mapDispatchToProps)(
  UnconnectedReservationTermsModal
);
