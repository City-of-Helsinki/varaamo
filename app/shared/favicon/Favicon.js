import React from 'react';
import Helmet from 'react-helmet';

import { getCurrentCustomization } from 'utils/customizationUtils';
import helsinkiFavicon from './helsinki-favicon.ico';
import espooFavicon from './espoo-favicon.ico';
import vantaaFavicon from './vantaa-favicon.ico';

const favicons = {
  ESPOO: espooFavicon,
  VANTAA: vantaaFavicon,
};

function Favicon() {
  const customization = getCurrentCustomization();
  const favicon = customization in favicons ? favicons[customization] : helsinkiFavicon;

  return <Helmet link={[{ href: favicon, rel: 'icon', type: 'image/x-icon' }]} />;
}

Favicon.propTypes = {};

export default Favicon;
