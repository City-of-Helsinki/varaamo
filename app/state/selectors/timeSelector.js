import moment from 'moment';
import queryString from 'query-string';

const timeSelector = (state, props) => {
  const time = queryString.parse(props.location.search).time;
  if (time) {
    return moment.utc(time).toISOString();
  }
  return time;
};

export default timeSelector;
