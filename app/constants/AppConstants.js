export default {
  API_URL: SETTINGS.API_URL,
  CUSTOMIZATIONS: {
    'varaamo.espoo.fi': 'ESPOO',
    'varaamotest-espoo.hel.ninja': 'ESPOO',
  },
  DATE_FORMAT: 'YYYY-MM-DD',
  DEFAULT_LOCALE: 'fi',
  FEEDBACK_URL: 'http://www.helmet-kirjasto.fi/varaamo-palaute/',
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
      labelTextId: 'common.cancelled',
    },
    confirmed: {
      labelBsStyle: 'success',
      labelTextId: 'common.confirmed',
    },
    denied: {
      labelBsStyle: 'danger',
      labelTextId: 'common.denied',
    },
    requested: {
      labelBsStyle: 'primary',
      labelTextId: 'common.requested',
    },
  },
  SHOW_TEST_SITE_MESSAGE: SETTINGS.SHOW_TEST_SITE_MESSAGE,
  SUPPORTED_LANGUAGES: ['en', 'fi', 'sv'],
  SUPPORTED_SEARCH_FILTERS: {
    date: '',
    people: '',
    purpose: '',
    search: '',
  },
  TIME_FORMAT: 'H:mm',
  TRACKING: SETTINGS.TRACKING,
};
