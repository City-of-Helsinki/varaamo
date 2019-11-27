import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';

import injectT from '../../../../app/i18n/injectT';

class ReservationCancelModal extends Component {
  render() {
    let { show } = this.props;
    return (
      <Modal
        onHide={() => {
          show = false;
          console.log('--- onHide');
        }}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Modal title
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Modal body
        </Modal.Body>

        <Modal.Footer>
          Modal Footer
        </Modal.Footer>
      </Modal>
    );
  }
}

ReservationCancelModal.propTypes = {
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationCancelModal);
