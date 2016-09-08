import moment from 'moment';
import { Factory } from 'rosie';

const BASE_DATE = moment().add(2, 'days');

const Reservation = new Factory()
  .sequence('index')
  .attr('begin', ['index'], (index) => (
    moment(BASE_DATE).set('hour', (index + 2) % 24).toISOString()
  ))
  .attr('comments', null)
  .attr('end', ['index'], (index) => (
    moment(BASE_DATE).set('hour', (index + 3) % 24).toISOString()
  ))
  .attr('resource', 'r-1')
  .attr('url', ['index'], (index) => (
    `http://api.hel.fi/respa/v1/reservation/${index}/`
  ));

export default Reservation;
