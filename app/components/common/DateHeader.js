import 'moment/locale/fi';

import capitalize from 'lodash/string/capitalize';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { findDOMNode } from 'react-dom';

import { scrollTo } from 'utils/DOMUtils';
import { addToDate } from 'utils/TimeUtils';

class DateHeader extends Component {
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

    const iconButtonStyles = {
      border: 'none',
      backgroundColor: 'transparent',
    };

    return (
      <h3
        className="date-header"
        id="date-header"
        style={{ textAlign: 'center' }}
      >
        <button
          onClick={() => onChange(addToDate(date, -1))}
          style={Object.assign({}, iconButtonStyles, { float: 'left' })}
        >
          <Glyphicon glyph="chevron-left" />
        </button>
        <button
          onClick={() => onChange(addToDate(date, 1))}
          style={Object.assign({}, iconButtonStyles, { float: 'right' })}
        >
          <Glyphicon glyph="chevron-right" />
        </button>
        {capitalize(dateString)}
      </h3>
    );
  }
}

DateHeader.propTypes = {
  date: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  scrollTo: PropTypes.bool,
};

export default DateHeader;
