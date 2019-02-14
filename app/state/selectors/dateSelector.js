import queryString from 'query-string';

import { getDateString } from 'utils/timeUtils';

const dateSelector = (state, props) => {
  const query = props && props.location ? queryString.parse(props.location.search) : {};
  return getDateString(query.date);
};

export default dateSelector;
