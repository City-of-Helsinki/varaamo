export default {
  API_URL: 'http://api.hel.fi/respa/v1',
  DATE_FORMAT: 'YYYY-MM-DD',
  PURPOSE_MAIN_TYPES: {
    meet_and_work: 'Järjestää kokouksen tai työskennellä',
    games: 'Pelata',
    audiovisual_work: 'Kuvaa tai ääntä',
    physical_work: 'Fyysisiä esineitä',
    watch_and_listen: 'Katsoa tai kuunnella',
    events_and_exhibitions: 'Pitää yleisötilaisuuden',
  },
  SUPPORTED_SEARCH_FILTERS: [
    'purpose',
    'search',
  ],
  TIME_FORMAT: 'H:mm',
};
