import AppConstants from 'constants/AppConstants';

export function track(trackData) {
  let interval = null;
  function pushAndClear() {
    if (window._paq) {
      window.clearInterval(interval);
      window._paq.push([trackData.event, ...trackData.args]);
    }
  }
  if (trackData) {
    interval = window.setInterval(pushAndClear, 500);
    pushAndClear();
  }
}

const tracking = () => dispatch => (action) => {
  const trackData = action.meta && action.meta.track;
  if (AppConstants.TRACKING && trackData) {
    window.setTimeout(
      () => track(trackData),
      0
    );
  }
  return dispatch(action);
};

export default tracking;
