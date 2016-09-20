import { connect } from 'react-redux';

import resourceListItemSelector from './resourceListItemSelector';
import ResourceListItem from './ResourceListItem';

export default connect(resourceListItemSelector)(ResourceListItem);
