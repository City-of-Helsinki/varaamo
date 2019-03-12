import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { injectT } from 'i18n';
import SelectControl from './controls/SelectControl';
import { sortResources } from '../../actions/sortActions';

class Sort extends Component {
  constructor(props) {
    super();
    this.state = {
      selected: '',
    };

    const { lang } = props;
    this.sortOptions = [
      { label: 'Name', value: `resource_name_${lang}` },
      { label: 'Type', value: 'type' },
      { label: 'Premises', value: `unit_name_${lang}` },
      { label: 'People', value: 'people_capacity' },
      { label: 'Open now', value: 'sortByOpenNow' },
    ];
  }

  dispatchSort = (sortName) => {
    const {
      actions, lang, resources, units
    } = this.props;

    this.setState({ selected: sortName });
    actions[sortName]({ lang, resources, units });
  }

  handleChange = (e) => {
    console.log(e, 'test handle vhan');
    this.props.actions('resource_name_en');
  }

  render() {
    return (
      <SelectControl
        id="sort"
        isLoading={false}
        label={this.props.t('SortBy.label')}
        onChange={this.handleChange}
        // onConfirm={this.dispatchSort}
        options={this.sortOptions}
        value={this.state.selected}
      />
    );
  }
}

const mapStateToProps = state => ({
  lang: state.intl.locale,
  resources: state.data.resources,
  units: state.data.units,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(sortResources, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectT(Sort));


Sort.propTypes = {
  actions: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  resources: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
