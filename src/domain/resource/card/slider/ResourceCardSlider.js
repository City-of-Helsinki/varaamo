import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/lib/Button';

import ResourceCard from '../ResourceCard';

class ResourceCardSlider extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    resources: PropTypes.array.isRequired,
    unit: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    onFavoriteClick: PropTypes.func.isRequired,
    onFilterClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
    };
  }

  onNext = () => {
    const { resources } = this.props;
    const { activeSlide } = this.state;
    this.setState({
      activeSlide: Math.min(activeSlide + 1, resources.length - 1),
    });
  };

  onPrevious = () => {
    const { activeSlide } = this.state;
    this.setState({
      activeSlide: Math.max(activeSlide - 1, 0),
    });
  };

  render() {
    const {
      resources,
      location,
      history,
      date,
      unit,
      onFavoriteClick,
      onFilterClick,
    } = this.props;
    const { activeSlide } = this.state;

    return (
      <div className="app-ResourceCardSlider">
        {resources.length > 1 && (
          <Button
            bsStyle="primary"
            className="app-ResourceCardSlider_arrow app-ResourceCardSlider_arrow-left"
            disabled={activeSlide === 0}
            onClick={this.onPrevious}
          />
        )}
        <ResourceCard
          date={date}
          history={history}
          isStacked={resources.length > 1}
          location={location}
          onFavoriteClick={onFavoriteClick}
          onFilterClick={onFilterClick}
          resource={resources[activeSlide]}
          unit={unit}
        />
        {resources.length > 1 && (
          <Button
            bsStyle="primary"
            className="app-ResourceCardSlider_arrow app-ResourceCardSlider_arrow-right"
            disabled={activeSlide === resources.length - 1}
            onClick={this.onNext}
          />
        )}
      </div>
    );
  }
}

export default withRouter(ResourceCardSlider);
