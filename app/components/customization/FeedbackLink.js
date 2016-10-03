import React, { Component, PropTypes } from 'react';

import constants from 'constants/AppConstants';
import { getCurrentCustomization } from 'utils/customizationUtils';

class FeedbackLink extends Component {
  render() {
    const refUrl = window.location.href;
    const href = `${constants.FEEDBACK_URL}?ref=${refUrl}`;

    switch (getCurrentCustomization()) {

      case 'ESPOO': {
        return <a className="feedback-link" href={href}>{this.props.text}</a>;
      }

      default: {
        return <a className="feedback-link" href={href}>{this.props.text}</a>;
      }
    }
  }
}

FeedbackLink.propTypes = {
  text: PropTypes.string.isRequired,
};

export default FeedbackLink;
