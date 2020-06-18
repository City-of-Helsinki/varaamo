import FeatureFlags from './FeatureFlags';

/**
 * getIsFeatureEnabled();
 * Returns true when feature is enabled.
 * @param flagName {string}
 * @returns {boolean}
 */
function getIsFeatureEnabled(flagName) {
  switch (flagName) {
    case FeatureFlags.FONT_SIZE_CONTROLS:
      return true;
    case FeatureFlags.CONTRAST_CONTROL:
      return false;
    default:
      return false;
  }
}

export default getIsFeatureEnabled;
