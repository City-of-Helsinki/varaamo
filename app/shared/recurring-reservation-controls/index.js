import RecurringReservationControls from './RecurringReservationControls';
import connect from './connectRecurringReservationControls';

// TODO: This shouldn't be here.
//  If you import the RecurringReservationControls component you don't get the connections.
export default connect(RecurringReservationControls);
