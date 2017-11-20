import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import schemas from 'store/middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/apiUtils';

function fetchUnits() {
  const fetchParams = { pageSize: 500 };

  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.UNITS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.UNITS_GET_SUCCESS,
          { schema: schemas.paginatedUnitsSchema }
        ),
        getErrorTypeDescriptor(types.API.UNITS_GET_ERROR),
      ],
      endpoint: buildAPIUrl('unit', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
      bailout: state => !state.api.shouldFetch.units,
    },
  };
}

export {
  fetchUnits,
};
