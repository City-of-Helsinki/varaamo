import queryString from 'query-string';

import { getDateString } from 'utils/timeUtils';

const dateSelector = (state, props) => {
  const query = props && props.location ?
    props.location.query :
    queryString.parse(queryString.extract(state.routing.path));
  return getDateString(query.date);
};

export default dateSelector;
