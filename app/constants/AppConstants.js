export default {
  API_URL: __API_URL__,
  CUSTOMIZATIONS: {
    'varaamo.espoo.fi': 'ESPOO',
    'varaamotest-espoo.hel.ninja': 'ESPOO',
  },
  DATE_FORMAT: 'YYYY-MM-DD',
  FEEDBACK_URL: 'http://www.helmet-kirjasto.fi/varaamo-palaute/',
  LOCALIZED_DATE_FORMAT: 'D.M.YYYY',
  NOTIFICATION_DEFAULTS: {
    message: '',
    type: 'info',
    timeOut: 5000,
    hidden: false,
  },
  REQUIRED_API_HEADERS: {
    Accept: 'application/json',
    'Accept-Language': 'fi',
    'Content-Type': 'application/json',
  },
  REQUIRED_STAFF_EVENT_FIELDS: [
    'eventDescription',
    'reserverName',
  ],
  RESERVATION_FORM_FIELDS: [
    'reserverName',
    'reserverEmailAddress',
    'reserverPhoneNumber',
    'eventDescription',
    'reserverAddressStreet',
    'reserverAddressZip',
    'reserverAddressCity',
    'company',
    'reserverId',
    'billingAddressStreet',
    'billingAddressZip',
    'billingAddressCity',
    'numberOfParticipants',
  ],
  RESERVATION_STATE_LABELS: {
    cancelled: {
      labelBsStyle: 'default',
      labelText: 'Peruttu',
    },
    confirmed: {
      labelBsStyle: 'success',
      labelText: 'Hyväksytty',
    },
    denied: {
      labelBsStyle: 'danger',
      labelText: 'Hylätty',
    },
    requested: {
      labelBsStyle: 'primary',
      labelText: 'Käsiteltävänä',
    },
  },
  SUPPORTED_SEARCH_FILTERS: {
    date: '',
    people: '',
    purpose: '',
    search: '',
  },
  TIME_FORMAT: 'H:mm',
  TRACKING: __TRACKING__,
};
