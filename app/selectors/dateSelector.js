import { getDateString } from 'utils/TimeUtils';

const dateSelector = (state, props) => getDateString(props.location.query.date);

export default dateSelector;
