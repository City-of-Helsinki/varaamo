import { colors } from 'constants/StyleConstants';

export default {
  footer: {
    backgroundColor: colors.blue,
    color: '#fff',
  },

  brandLink: {
    color: '#fff',
    fontSize: '36px',
    lineHeight: '80px',
    marginBottom: '30px',
    display: 'block',

    '@media (min-width: 992px)': {
      marginBottom: '0px',
    },
  },

  logo: {
    display: 'inline-block',
    verticalAlign: 'top',
    height: 80,
    marginRight: 20,
  },

  link: {
    color: '#ccc',
  },
};
