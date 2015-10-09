import moment from 'moment';
import 'moment-range';

export default {
  getTimeSlots,
};

function getTimeSlots(start, end, period = '00:30:00') {
  if (!start || !end) {
    return [];
  }

  const range = moment.range(moment.utc(start), moment.utc(end));
  const duration = moment.duration(period);
  const FORMAT = 'H:mm';
  const slots = [];

  range.by(duration, (startMoment) => {
    const endMoment = moment(startMoment).add(duration);
    const asString = `${startMoment.format(FORMAT)}\u2013${endMoment.format(FORMAT)}`;

    slots.push({
      asString,
      start: startMoment.toISOString(),
      end: endMoment.toISOString(),
    });
  }, true);

  return slots;
}
