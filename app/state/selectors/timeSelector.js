import moment from 'moment';
import queryString from 'query-string';

const timeSelector = (state, props) => {
  const query =
    props && props.location ? queryString.parse(props.location.search) : {};
  const { time } = query;

  if (time) {
    return moment.utc(time).toISOString();
  }

  return time;
};

export default timeSelector;
