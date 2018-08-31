import React, { PropTypes } from 'react';

import constants from 'constants/AppConstants';
import { getCurrentCustomization } from 'utils/customizationUtils';

function OldVersionLink({ children }) {
  const refUrl = window.location.href;
  const href = `${constants.OLD_VERSION_URL}&ref=${refUrl}`;

  switch (getCurrentCustomization()) {
    case 'ESPOO':
    case 'VANTAA': {
      return <a className="oldversion-link" href={href}>{children}</a>;
    }

    default: {
      return <a className="oldversion-link" href={href}>{children}</a>;
    }
  }
}

OldVersionLink.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OldVersionLink;
