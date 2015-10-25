import moment from 'moment';
import { Factory } from 'rosie';

const BASE_DATE = new Date(2015, 10, 10);

const Reservation = new Factory()
  .sequence('index')
  .attr('begin', ['index'], (index) => {
    return moment(BASE_DATE).set('hour', (index + 2) % 24).toISOString();
  })
  .attr('end', ['index'], (index) => {
    return moment(BASE_DATE).set('hour', (index + 3) % 24).toISOString();
  })
  .attr('resource', 'r-1')
  .attr('url', ['index'], (index) => {
    return `http://api.hel.fi/respa/v1/reservation/${index}/`;
  });

export default Reservation;
