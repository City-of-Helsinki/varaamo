import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import resourceCardSelector from './resourceCardSelector';
import ResourceCard from './ResourceCard';
import { favoriteResource, unfavoriteResource } from 'actions/resourceActions';

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    favoriteResource,
    unfavoriteResource,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(resourceCardSelector, mapDispatchToProps)(ResourceCard);
