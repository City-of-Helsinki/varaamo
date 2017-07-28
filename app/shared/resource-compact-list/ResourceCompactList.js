import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { connect } from 'react-redux';

import ResourceCard from 'shared/resource-card';
import selector from './ResourceCompactListSelector';

export class UnconnectedResourceCompactList extends React.Component {
  static propTypes = {
    resourceIds: PropTypes.array.isRequired,
  };

  state = {
    resourcePosition: 0,
  }

  componentWillReceiveProps() {
    this.setState({
      resourcePosition: 0,
    });
  }

  onPreviousResource = () => {
    // Javascript mod operator (%) does not work as expected an the module of a negative number
    // is calculated like -(i % i_max) which would lead on a negative resourcePosition.
    this.setState({
      resourcePosition: (
        (this.state.resourcePosition - 1) + this.props.resourceIds.length
      ) % this.props.resourceIds.length,
    });
  }

  onNextResource = () => {
    this.setState({
      resourcePosition: (this.state.resourcePosition + 1) % this.props.resourceIds.length,
    });
  }

  render() {
    return (
      <div className="app-ResourceCompactList">
        {Boolean(this.props.resourceIds.length - 1) &&
          <button
            className="app-ResourceCompactList_arrow app-ResourceCompactList_arrow-left"
            onClick={this.onPreviousResource}
          >
            <Glyphicon glyph="chevron-left" />
          </button>
        }
        <ResourceCard
          resourceId={this.props.resourceIds[this.state.resourcePosition]}
          stacked={Boolean(this.props.resourceIds.length - 1)}
        />
        {Boolean(this.props.resourceIds.length - 1) &&
          <button
            className="app-ResourceCompactList_arrow app-ResourceCompactList_arrow-right"
            onClick={this.onNextResource}
          >
            <Glyphicon glyph="chevron-right" />
          </button>
        }
      </div>
    );
  }
}


export default connect(selector)(UnconnectedResourceCompactList);
