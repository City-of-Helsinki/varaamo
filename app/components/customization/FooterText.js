import React, { Component } from 'react';

import { FEEDBACK_URL } from 'constants/AppConstants';
import { getCurrentCustomization } from 'utils/CustomizationUtils';

class FooterText extends Component {
  handleFeedbackClick(event) {
    event.preventDefault();
    const refUrl = window.location.href;
    window.location = `${FEEDBACK_URL}?ref=${refUrl}`;
  }

  render() {
    switch (getCurrentCustomization()) {

    case 'ESPOO':
      return <p>Placeholder text for Espoo footer.</p>;

    default:
      const feedbackLink = (
        <a
          className="feedback-link"
          href={FEEDBACK_URL}
          onClick={this.handleFeedbackClick}
        >
          täältä
        </a>
      );

      return (
        <p>
          Varaamo on Helsingin kaupungin tilanvarauspalvelu.
          Kyseessä on pilottiversio, josta toivomme Sinulta palautetta.
          Palautteesi voit lähettää {feedbackLink}.
        </p>
      );
    }
  }
}

FooterText.propTypes = {};

export default FooterText;
