import { getDateString } from 'utils/timeUtils';

const dateSelector = (state, props) => {
  const query = props && props.location ? props.location.query : {};
  return getDateString(query.date);
};

export default dateSelector;
