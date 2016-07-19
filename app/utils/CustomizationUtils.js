import React from 'react';

import { CUSTOMIZATIONS } from 'constants/AppConstants';

function getCurrentCustomization() {
  const host = window.location.host;
  return CUSTOMIZATIONS[host] || null;
}

function renderStyleCustomizations() {
  switch (getCurrentCustomization()) {

  case 'ESPOO':
    const isProduction = process.env.NODE_ENV === 'production';
    const href = isProduction ? '/_assets/espoo.css' : '/espoo.css';
    return (
      <link
        rel="stylesheet"
        type="text/css"
        href={href}
      />
    );

  default:
    return null;
  }
}

export default {
  getCurrentCustomization,
  renderStyleCustomizations,
};
