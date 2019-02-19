/*eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux'; 
import SelectControl from './controls/SelectControl';
import * as filterActions from '../../actions/filterActions';
import { bindActionCreators } from 'redux';

class Filter extends Component {
  constructor() {
    super();
    this.state ={
        selected: ''
    }
    this.filterOptions = [
      { label: 'Name', value: 'filterByName' },
      { label: 'Type', value: 'filterByType' },
      { label: 'Premises', value: 'filterByPremises' },
      { label: 'People', value: 'filterByPeople' },
      { label: 'Open now', value: 'filterByOpenNow' }
    ];
  }

  dispatchFilter = filterName => {
    let {actions, lang, resources, units} = this.props;
    this.setState({ selected : filterName })
    actions[filterName]({ lang, resources, units });
  }

  render() {
    return (
      <SelectControl
        id="filter"
        isLoading={false}
        label="Sort By"
        onConfirm={ this.dispatchFilter }
        options={this.filterOptions}
        t={() => {}}
        value={this.state.selected}
      />
    );
  }
}

const mapStateToProps = state =>({
  lang:state.intl.locale,
  resources:state.data.resources,
  units: state.data.units,
})
const mapDispatchToProps = dispatch =>({
  actions: bindActionCreators(filterActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter)
/*eslint-enable*/

