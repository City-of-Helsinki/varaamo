import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { injectT } from 'i18n';
import DatePicker from 'shared/date-picker';

export class UninjectedDateSelector extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    range: PropTypes.oneOf(['day', 'week']).isRequired,
    t: PropTypes.func.isRequired,
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
    const { range } = this.props;
    this.handleChange(moment(this.props.value).add(1, range).format('YYYY-MM-DD'));
  }

  handlePreviousClick() {
    const { range } = this.props;
    this.handleChange(moment(this.props.value).subtract(1, range).format('YYYY-MM-DD'));
  }

  render() {
    const { range, value } = this.props;

    return (
      <div className="date-selector">
        <a className="previous" onClick={this.handlePreviousClick} tabIndex="0">
          {range === 'week'
            ? this.props.t('AvailabilityViewDateSelector.previousWeek')
            : this.props.t('AvailabilityViewDateSelector.previousDay')
          }
        </a>
        <div className="current-value">
          <DatePicker
            dateFormat="dd D.M.YYYY"
            onChange={date => this.handleChange(date)}
            value={value}
          />
        </div>
        <a className="next" onClick={this.handleNextClick} tabIndex="0">
          {range === 'week'
            ? this.props.t('AvailabilityViewDateSelector.nextWeek')
            : this.props.t('AvailabilityViewDateSelector.nextDay')
          }
        </a>
      </div>
    );
  }
}

export default injectT(UninjectedDateSelector);
