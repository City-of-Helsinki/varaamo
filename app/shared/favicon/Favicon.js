import React from 'react';
import Helmet from 'react-helmet';

import { getCurrentCustomization } from 'utils/customizationUtils';
import helsinkiFavicon from './helsinki-favicon.ico';
import espooFavicon from './espoo-favicon.ico';

function Favicon() {
  const favicon = getCurrentCustomization() === 'ESPOO' ? espooFavicon : helsinkiFavicon;
  return <Helmet link={[{ href: favicon, rel: 'icon', type: 'image/x-icon' }]} />;
}

Favicon.propTypes = {};

export default Favicon;
