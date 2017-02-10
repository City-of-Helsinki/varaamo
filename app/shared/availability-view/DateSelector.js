import React, { PropTypes } from 'react';
import moment from 'moment';

import DatePicker from 'shared/date-picker';

export default class DateSelector extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
  }

  handleChange(newValue) {
    if (moment(newValue).isValid()) {
      this.props.onChange(newValue);
    }
  }

  handleNextClick() {
    this.handleChange(moment(this.props.value).add(1, 'day').format('YYYY-MM-DD'));
  }

  handlePreviousClick() {
    this.handleChange(moment(this.props.value).subtract(1, 'day').format('YYYY-MM-DD'));
  }

  render() {
    return (
      <div className="date-selector">
        <a className="previous" onClick={this.handlePreviousClick} tabIndex="0">
          Edellinen päivä
        </a>
        <div className="current-value" >
          <DatePicker
            dateFormat="dd D.M.YYYY"
            onChange={date => this.handleChange(date)}
            value={this.props.value}
          />
        </div>
        <a className="next" onClick={this.handleNextClick} tabIndex="0">
          Seuraava päivä
        </a>
      </div>
    );
  }
}
