import { getDateString } from 'utils/TimeUtils';

const dateSelector = (state) => getDateString(state.router.location.query.date);

export default dateSelector;
