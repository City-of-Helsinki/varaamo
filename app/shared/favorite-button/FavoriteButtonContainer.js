import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { favoriteResource, unfavoriteResource } from 'actions/resourceActions';
import FavoriteButton from './FavoriteButton';

export class UnconnectedFavoriteButtonContainer extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { actions, resource } = this.props;
    if (resource.isFavorite) {
      actions.unfavoriteResource(resource.id);
    } else {
      actions.favoriteResource(resource.id);
    }
  }

  render() {
    return (
      <FavoriteButton
        favorited={this.props.resource.isFavorite}
        onClick={this.handleClick}
      />
    );
  }
}

UnconnectedFavoriteButtonContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  resource: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired,
  }).isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    favoriteResource,
    unfavoriteResource,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(null, mapDispatchToProps)(UnconnectedFavoriteButtonContainer);
