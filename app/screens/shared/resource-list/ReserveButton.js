import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { LinkContainer } from 'react-router-bootstrap';

function ReserveButton({ date, isLoggedIn, resource }) {
  const isReservable = isLoggedIn && resource.reservable;
  let buttonText;

  if (isReservable) {
    buttonText = resource.needManualConfirmation ? 'Tee alustava varaus' : 'Varaa';
  } else {
    buttonText = 'Katso varaustilanne';
  }

  return (
    <LinkContainer
      to={`/resources/${resource.id}/reservation`}
      query={{ date: date.split('T')[0] }}
    >
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
  }).isRequired,
};

export default ReserveButton;
