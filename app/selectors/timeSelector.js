import moment from 'moment';

const timeSelector = (state) => {
  const time = state.router.location.query.time;
  if (time) {
    return moment.utc(time).toISOString();
  }
  return time;
};

export default timeSelector;
