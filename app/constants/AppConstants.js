export default {
  API_URL: 'http://api.hel.fi/respa/v1',
  DATE_FORMAT: 'YYYY-MM-DD',
  NOTIFICATION_DEFAULTS: {
    message: '',
    type: 'info',
    timeOut: 5000,
    hidden: false,
  },
  PURPOSE_MAIN_TYPES: {
    meet_and_work: 'Järjestää kokouksen tai työskennellä',
    games: 'Pelata',
    audiovisual_work: 'Kuvaa tai ääntä',
    physical_work: 'Fyysisiä esineitä',
    watch_and_listen: 'Katsoa tai kuunnella',
    events_and_exhibitions: 'Pitää yleisötilaisuuden',
  },
  REQUIRED_API_HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  SUPPORTED_SEARCH_FILTERS: {
    date: '',
    purpose: '',
    search: '',
  },
  TIME_FORMAT: 'H:mm',
};
