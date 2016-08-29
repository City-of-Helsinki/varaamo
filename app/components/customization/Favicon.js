import React from 'react';
import ReactFavicon from 'react-favicon';

import { getCurrentCustomization } from 'utils/CustomizationUtils';

import helsinkiFavicon from 'assets/images/helsinki-favicon.ico';
import espooFavicon from 'assets/images/espoo-favicon.ico';

function Favicon() {
  const favicon = getCurrentCustomization() === 'ESPOO' ? espooFavicon : helsinkiFavicon;
  return <ReactFavicon url={[favicon]} />;
}

Favicon.propTypes = {};

export default Favicon;
