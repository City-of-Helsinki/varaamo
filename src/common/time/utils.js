import moment from 'moment';

import { DEFAULT_TIME_FORMAT } from './constants';

export const momentGetter = arg => moment(arg);

export const formatTime = (time, formatString) => {
  return momentGetter(time).format(formatString || DEFAULT_TIME_FORMAT);
};
