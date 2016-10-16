import React from 'react';
import ReactFavicon from 'react-favicon';

import { getCurrentCustomization } from 'utils/customizationUtils';
import helsinkiFavicon from './helsinki-favicon.ico';
import espooFavicon from './espoo-favicon.ico';

function Favicon() {
  const favicon = getCurrentCustomization() === 'ESPOO' ? espooFavicon : helsinkiFavicon;
  return <ReactFavicon url={[favicon]} />;
}

Favicon.propTypes = {};

export default Favicon;
