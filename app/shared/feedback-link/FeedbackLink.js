import React, { PropTypes } from 'react';

import constants from 'constants/AppConstants';
import { getCurrentCustomization } from 'utils/customizationUtils';

function FeedbackLink({ children }) {
  const href = `${constants.FEEDBACK_URL}`;

  switch (getCurrentCustomization()) {
    case 'ESPOO': {
      return <a className="feedback-link" href={href}>{children}</a>;
    }

    default: {
      return <a className="feedback-link" href={href}>{children}</a>;
    }
  }
}

FeedbackLink.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FeedbackLink;
