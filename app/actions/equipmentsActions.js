import { RSAA } from 'redux-api-middleware';

import types from '../constants/ActionTypes';
import schemas from '../store/middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from '../utils/apiUtils';

function fetchEquipments(params = {}, source) {
  const fetchParams = Object.assign({}, params);

  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(types.API.EQUIPMENTS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.EQUIPMENTS_GET_SUCCESS,
          {
            meta: { source },
            schema: schemas,
          }
        ),
        getErrorTypeDescriptor(types.API.RESOURCES_GET_ERROR),
      ],
      endpoint: 'https://respa.koe.hel.ninja/v1/resource/',
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

export {
  fetchEquipments,
};
