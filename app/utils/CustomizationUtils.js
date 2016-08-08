import { CUSTOMIZATIONS } from 'constants/AppConstants';

function getCurrentCustomization() {
  const host = window.location.host;
  return CUSTOMIZATIONS[host] || null;
}

function getCustomizationClassName() {
  switch (getCurrentCustomization()) {

  case 'ESPOO':
    return 'espoo-customizations';

  default:
    return '';
  }
}

export default {
  getCurrentCustomization,
  getCustomizationClassName,
};
