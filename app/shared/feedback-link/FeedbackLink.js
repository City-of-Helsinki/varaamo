import React, { PropTypes } from 'react';

import constants from 'constants/AppConstants';
import { getCurrentCustomization } from 'utils/customizationUtils';

function FeedbackLink({ text }) {
  const refUrl = window.location.href;
  const href = `${constants.FEEDBACK_URL}?ref=${refUrl}`;

  switch (getCurrentCustomization()) {
    case 'ESPOO': {
      return <a className="feedback-link" href={href}>{text}</a>;
    }

    default: {
      return <a className="feedback-link" href={href}>{text}</a>;
    }
  }
}

FeedbackLink.propTypes = {
  text: PropTypes.string.isRequired,
};

export default FeedbackLink;
