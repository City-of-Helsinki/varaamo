import moment from 'moment';
import { Factory } from 'rosie';

const BASE_DATE = new Date(2015, 10, 10);

const TimeSlot = new Factory()
  .sequence('index')
  .attr('asString', ['index'], (index) => {
    const start = index % 24;
    return `${start}:00-${start + 1}:00`;
  })
  .attr('asISOString', ['index'], (index) => {
    const start = moment(BASE_DATE).set('hour', (index + 2) % 24).toISOString();
    const end = moment(BASE_DATE).set('hour', (index + 3) % 24).toISOString();
    return `${start}/${end}`;
  })
  .attr('start', ['index'], (index) => {
    return moment(BASE_DATE).set('hour', (index + 2) % 24).toISOString();
  })
  .attr('end', ['index'], (index) => {
    return moment(BASE_DATE).set('hour', (index + 3) % 24).toISOString();
  })
  .attr('reserved', false);

export default TimeSlot;
