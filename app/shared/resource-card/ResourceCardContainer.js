import { connect } from 'react-redux';

import resourceCardSelector from './resourceCardSelector';
import ResourceCard from './ResourceCard';

export default connect(resourceCardSelector)(ResourceCard);
