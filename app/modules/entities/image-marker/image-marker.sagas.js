import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import ImageMarkerActions from './image-marker.reducer';

function* getImageMarker(api, action) {
  const { imageMarkerId } = action;
  // make the call to the api
  const apiCall = call(api.getImageMarker, imageMarkerId);
  const response = yield call(callApi, apiCall);
  // success?
  if (response.ok) {
    yield put(ImageMarkerActions.imageMarkerSuccess(response.data));
  } else {
    yield put(ImageMarkerActions.imageMarkerFailure(response.data));
  }
}

function* getAllImageMarkers(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllImageMarkers, options);
  const response = yield call(callApi, apiCall);
  // success?
  if (response.ok) {
    yield put(ImageMarkerActions.imageMarkerAllSuccess(response.data, response.headers));
  } else {
    yield put(ImageMarkerActions.imageMarkerAllFailure(response.data));
  }
}

function* updateImageMarker(api, action) {
  const { imageMarker } = action;
  // make the call to the api
  const idIsNotNull = !(imageMarker.id === null || imageMarker.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateImageMarker : api.createImageMarker, imageMarker);
  const response = yield call(callApi, apiCall);
  // success?
  if (response.ok) {
    yield put(ImageMarkerActions.imageMarkerUpdateSuccess(response.data));
  } else {
    yield put(ImageMarkerActions.imageMarkerUpdateFailure(response.data));
  }
}

function* deleteImageMarker(api, action) {
  const { imageMarkerId } = action;
  // make the call to the api
  const apiCall = call(api.deleteImageMarker, imageMarkerId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(ImageMarkerActions.imageMarkerDeleteSuccess());
  } else {
    yield put(ImageMarkerActions.imageMarkerDeleteFailure(response.data));
  }
}

export default {
  getAllImageMarkers,
  getImageMarker,
  deleteImageMarker,
  updateImageMarker,
};
