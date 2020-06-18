import constants from '../constants/AppConstants';

function getDefaultMunicipality() {
  const host = window.location.host;

  switch (host) {
    case 'hel':
      return 'helsinki';
    case 'espoo':
      return 'espoo';
    case 'vantaa':
      return 'vantaa';
    default:
      return undefined;
  }
}

function getCurrentCustomization() {
  const host = window.location.host;
  return constants.CUSTOMIZATIONS[host] || null;
}

function getCustomizationClassName() {
  switch (getCurrentCustomization()) {
    case 'ESPOO': {
      return 'espoo-customizations';
    }

    case 'VANTAA': {
      return 'vantaa-customizations';
    }

    default: {
      return '';
    }
  }
}

export {
  getCurrentCustomization,
  getCustomizationClassName,
  getDefaultMunicipality,
};
