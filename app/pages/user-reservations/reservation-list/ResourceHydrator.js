import PropTypes from 'prop-types';
import { Component } from 'react';
import get from 'lodash/get';

import client from '../../../../src/common/api/client';

class ResourceHydrator extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
  }

  state = {
    loading: false,
    data: null,
    error: null,
  }

  componentDidMount() {
    const { id } = this.props;

    this.setState({
      loading: false,
    });

    client.get(`resource/${id}`)
      .then((response) => {
        this.setState({
          loading: false,
          data: get(response, 'data', null),
        });
      });
  }

  render() {
    return this.props.children(this.state);
  }
}

export default ResourceHydrator;
