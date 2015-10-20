const brandWidth = 200;

export default {
  navBrand: {
    position: 'absolute',
    left: '50%',
    width: brandWidth,
    textAlign: 'center',
    marginLeft: -(brandWidth / 2),
    color: '#fff',
  },

  logo: {
    display: 'inline-block',
    verticalAlign: 'top',
    height: 40,
    marginTop: -8,
    marginRight: 10,
  },

  searchNav: {
    '@media (max-width: 767px)': {
      position: 'absolute',
      top: 9,
      margin: 0,
    },
  },
};
