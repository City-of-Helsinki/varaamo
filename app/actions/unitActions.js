import types from 'constants/ActionTypes';

import { CALL_API } from 'redux-api-middleware';

import schemas from 'store/middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/apiUtils';

function fetchUnits() {
  const fetchParams = { pageSize: 500, unit_has_resource: true };

  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(types.API.UNITS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.UNITS_GET_SUCCESS,
          { schema: schemas.paginatedUnitsSchema },
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
