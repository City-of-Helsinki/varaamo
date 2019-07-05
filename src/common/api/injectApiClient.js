import { connect } from 'react-redux';
import get from 'lodash/get';

import ApiClient from './client';
import constants from '../../../app/constants/AppConstants';

const mapStateToProps = (state) => {
  const authToken = get(state, 'auth.token');
  const apiClient = new ApiClient(constants.API_URL, authToken);
  return {
    apiClient,
  };
};

const injectApiClient = connect(mapStateToProps);

export default injectApiClient;
