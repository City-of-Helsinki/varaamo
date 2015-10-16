import 'moment/locale/fi';

import _ from 'lodash';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Glyphicon } from 'react-bootstrap';

import { addToDate } from 'utils/TimeUtils';

export class DateHeader extends Component {
  render() {
    const { date, onChange } = this.props;
    const dateString = moment(date).format('dddd, LL');

    const iconButtonStyles = {
      border: 'none',
      backgroundColor: 'transparent',
    };

    return (
      <h3 className="date-header" style={{ textAlign: 'center' }}>
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
        {_.capitalize(dateString)}
      </h3>
    );
  }
}

DateHeader.propTypes = {
  date: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateHeader;
