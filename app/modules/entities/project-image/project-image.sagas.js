import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import ProjectImageActions from './project-image.reducer';
import { convertDateTimeFromServer } from '../../../shared/util/date-transforms';

function* getProjectImage(api, action) {
  const { projectImageId } = action;
  // make the call to the api
  const apiCall = call(api.getProjectImage, projectImageId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(ProjectImageActions.projectImageSuccess(response.data));
  } else {
    yield put(ProjectImageActions.projectImageFailure(response.data));
  }
}

function* getAllProjectImages(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllProjectImages, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(ProjectImageActions.projectImageAllSuccess(response.data, response.headers));
  } else {
    yield put(ProjectImageActions.projectImageAllFailure(response.data));
  }
}

function* updateProjectImage(api, action) {
  const { projectImage } = action;
  // make the call to the api
  const idIsNotNull = !(projectImage.id === null || projectImage.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateProjectImage : api.createProjectImage, projectImage);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(ProjectImageActions.projectImageUpdateSuccess(response.data));
  } else {
    yield put(ProjectImageActions.projectImageUpdateFailure(response.data));
  }
}

function* deleteProjectImage(api, action) {
  const { projectImageId } = action;
  // make the call to the api
  const apiCall = call(api.deleteProjectImage, projectImageId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(ProjectImageActions.projectImageDeleteSuccess());
  } else {
    yield put(ProjectImageActions.projectImageDeleteFailure(response.data));
  }
}
function mapDateFields(data) {
  data.projectImageUploadDate = convertDateTimeFromServer(data.projectImageUploadDate);
  return data;
}

export default {
  getAllProjectImages,
  getProjectImage,
  deleteProjectImage,
  updateProjectImage,
};
