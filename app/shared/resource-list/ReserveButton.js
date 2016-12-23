import moment from 'moment';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { LinkContainer } from 'react-router-bootstrap';

import { injectT } from 'i18n';
import {
  getOpeningHours,
  getResourcePageUrl,
  reservingIsRestricted,
} from 'utils/resourceUtils';
import { isPastDate } from 'utils/timeUtils';

function ReserveButton({ date, isLoggedIn, resource, t }) {
  const { closes } = getOpeningHours(resource);
  const isClosed = !closes || moment() > moment(closes);
  const hideButton = isClosed || isPastDate(date) || reservingIsRestricted(resource, date);

  if (hideButton) {
    return <span />;
  }

  const isReservable = isLoggedIn && resource.reservable;
  let buttonText;

  if (isReservable) {
    buttonText = resource.needManualConfirmation ?
      t('ReserveButton.makePreliminaryReservation') :
      t('ReserveButton.makeRegularReservation');
  } else {
    buttonText = t('ReserveButton.notReservableText');
  }

  return (
    <LinkContainer to={getResourcePageUrl(resource, date)}>
      <Button bsStyle="primary">
        {buttonText}
      </Button>
    </LinkContainer>
  );
}

ReserveButton.propTypes = {
  date: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.shape({
    needManualConfirmation: PropTypes.bool.isRequired,
    reservable: PropTypes.bool.isRequired,
    userPermissions: PropTypes.object.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReserveButton);
