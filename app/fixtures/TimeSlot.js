import moment from 'moment';
import { Factory } from 'rosie';

const BASE_DATE = new Date(2015, 10, 10);

const TimeSlot = new Factory()
  .sequence('asString', (index) => {
    const start = index % 24;
    return `${start}:00-${start + 1}:00`;
  })
  .sequence('start', (index) => moment(BASE_DATE).set('hour', (index + 2) % 24).toISOString())
  .sequence('end', (index) => moment(BASE_DATE).set('hour', (index + 3) % 24).toISOString());

export default TimeSlot;
