import moment from 'moment';

const timeSelector = (state, props) => {
  const time = props.location.query.time;
  if (time) {
    return moment.utc(time).toISOString();
  }
  return time;
};

export default timeSelector;
