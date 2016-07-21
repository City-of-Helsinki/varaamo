import { CUSTOMIZATIONS } from 'constants/AppConstants';

function getCurrentCustomization() {
  const host = window.location.host;
  return CUSTOMIZATIONS[host] || null;
}

export default {
  getCurrentCustomization,
};
