import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import { FormattedHTMLMessage } from 'react-intl';

import injectT from '../../../../app/i18n/injectT';

const ReservationCancelNotAllowed = ({
  billable,
  parentToggle,
  resource,
  t,
  toggleShow,
}) => {
  const [show, setShow] = useState(toggleShow);

  const handleClose = () => {
    setShow(() => false);
    parentToggle && parentToggle(false);
  };

  return (
    <Modal
      onHide={handleClose}
      show={show}
    >
      <Modal.Header>
        <Modal.Title>
          {t('ReservationCancelModal.cancelNotAllowedTitle')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {billable ? (
            <>
              <p>{t('ReservationCancelModal.cancelNotAllowedInfoOnlinePayment.1')}</p>
              <p>{t('ReservationCancelModal.cancelNotAllowedInfoOnlinePayment.2')}</p>
            </>
          )
            : (
              <>
                <p>{t('ReservationCancelModal.cancelNotAllowedInfo')}</p>
                <p><FormattedHTMLMessage id="ReservationCancelModal.takeIntoAccount" /></p>
              </>
            )}
          <p>{resource.responsibleContactInfo}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="default"
          onClick={handleClose}
        >
          {t('common.back')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ReservationCancelNotAllowed.propTypes = {
  resource: PropTypes.object.isRequired,
  parentToggle: PropTypes.func,
  t: PropTypes.func.isRequired,
  toggleShow: PropTypes.bool.isRequired,
  billable: PropTypes.bool.isRequired,
};

export default injectT(ReservationCancelNotAllowed);
