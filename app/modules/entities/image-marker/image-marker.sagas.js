import { Alert } from 'react-native';
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

function* getProjectImageMarkers(api, action) {
  const { projectId } = action;
  // make the call to the api
  const apiCall = call(api.getProjectImageMarkers, projectId);
  const response = yield call(callApi, apiCall);
  // console.log('response Nitin', response.data);
  // success?
  if (response.ok) {
    yield put(ImageMarkerActions.imageMarkerByProjectSuccess(response.data));
  } else {
    yield put(ImageMarkerActions.imageMarkerByProjectFailure(response.data));
  }
}

function* updateProjectImageMarkers(action) {
  // console.log("update DATA NNN", action.imageProjectMarkerList);
  yield put(ImageMarkerActions.imageMarkerByProjectSuccess(action.imageProjectMarkerList));
}

//By JY
function* openMarkerInfoModal(action) {
  console.log("---update DATA--",action.markerInfoModalvisible);
  // yield put(ImageMarkerActions.imageMarkerInfoPopup(action.visible));
}



//actions
//manipulate State
//api
//success 
//fail => Rollback
 
function* updateImageMarker(api, action) {
  const { imageMarker } = action;
  console.log(imageMarker,'marker');
  // make the call to the api
  const idIsNotNull = !(imageMarker.id === null || imageMarker.id === undefined);
  console.log('idIsNotNull',idIsNotNull);
  console.log("imageMarker.id",imageMarker.id);
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
  console.log("MarkerId", imageMarkerId);
  // make the call to the api
  const apiCall = call(api.deleteImageMarker, imageMarkerId);
  const response = yield call(callApi, apiCall);
  console.log('response', response.data);
  // success?
  if (response.ok) {
   
    yield put(ImageMarkerActions.imageMarkerDeleteSuccess());
    setTimeout(()=>{
      Alert.alert('Delete', 'Marker Deleted Successfully');
    },300);
  } else {
    yield put(ImageMarkerActions.imageMarkerDeleteFailure(response.data));
  }
}

export default {
  getAllImageMarkers,
  getImageMarker,
  deleteImageMarker,
  updateImageMarker,
  getProjectImageMarkers,
  updateProjectImageMarkers,
  openMarkerInfoModal
};
