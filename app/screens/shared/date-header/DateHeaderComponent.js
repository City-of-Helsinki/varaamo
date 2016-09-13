import capitalize from 'lodash/capitalize';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { findDOMNode } from 'react-dom';

import { scrollTo } from 'utils/DOMUtils';
import { addToDate } from 'utils/TimeUtils';

class DateHeaderComponent extends Component {
  componentDidMount() {
    if (this.props.scrollTo) {
      // Use timeout to allow rest of the page render and the scrollTo to work properly.
      setTimeout(() => {
        scrollTo(findDOMNode(this));
      }, 100);
    }
  }

  render() {
    const { date, onChange } = this.props;
    const dateString = moment(date).format('dddd, LL');

    return (
      <h3 className="date-header" id="date-header">
        {onChange && (
          <button
            className="date-header-button decrease-date"
            onClick={() => onChange(addToDate(date, -1))}
          >
            <Glyphicon glyph="chevron-left" />
          </button>
        )}
        {onChange && (
          <button
            className="date-header-button increase-date"
            onClick={() => onChange(addToDate(date, 1))}
          >
            <Glyphicon glyph="chevron-right" />
          </button>
        )}
        {capitalize(dateString)}
      </h3>
    );
  }
}

DateHeaderComponent.propTypes = {
  date: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  scrollTo: PropTypes.bool,
};

export default DateHeaderComponent;
