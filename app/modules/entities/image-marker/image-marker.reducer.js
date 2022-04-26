import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  imageMarkerRequest: ['imageMarkerId'],
  imageMarkerAllRequest: ['options'],
  imageMarkerByProjectRequest: ['projectId'],
  imageMarkerUpdateRequest: ['imageMarker'],
  imageMarkerDeleteRequest: ['imageMarkerId'],

  imageMarkerSuccess: ['imageMarker'],
  imageMarkerAllSuccess: ['imageMarkerList', 'headers'],
  imageMarkerByProjectSuccess: ['imageProjectMarkerList'],
  imageMarkerUpdateSuccess: ['imageMarker'],
  imageMarkerDeleteSuccess: ['deleteMarker'],

  imageMarkerFailure: ['error'],
  imageMarkerAllFailure: ['error'],
  imageMarkerByProjectFailure: ['error'],
  imageMarkerUpdateFailure: ['error'],
  imageMarkerDeleteFailure: ['error'],

  imageMarkerReset: [],

  //By JY
  imageMarkerOPT: ['imageProjectMarkerList'],
  imageMarkerInfoPopup: ['markerInfoModalvisible'],
  photoCameraPopup: ['photoCameraModalVisible'],  
});

export const ImageMarkerTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  markerInfoModalvisible: false,
  photoCameraModalVisible: false,
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  imageMarker: { id: undefined },
  imageMarkerList: [],
  imageProjectMarkerList:[],
  errorOne: null,
  errorAll: null,
  errorUpdating: null,
  errorDeleting: null,
  links: { next: 0 },
  totalItems: 0,
  fetchMarkerList: false,
});

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({
    fetchingOne: true,
    errorOne: false,
    imageMarker: INITIAL_STATE.imageMarker,
  });

// request the data from an api
export const allRequest = (state) =>
  state.merge({
    fetchingAll: true,
    errorAll: false,
  });

export const markerByProjectRequest = (state) =>
  state.merge({
    fetchingAll: true,
    errorAll: false,
    fetchMarkerList: false
  });

// request to update from an api
export const updateRequest = (state) =>
  state.merge({
    updateSuccess: false,
    updating: true,
    fetchMarkerList: false
  });
// request to delete from an api
export const deleteRequest = (state) =>
  state.merge({
    deleting: true,
  });

// successful api lookup for single entity
export const success = (state, action) => {
  const { imageMarker } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    imageMarker,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { imageMarkerList } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    imageMarkerList: imageMarkerList,
  });
};

// successful api lookup for all entities
export const projectMarkerSuccess = (state, action) => {
  const { imageProjectMarkerList } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    imageProjectMarkerList,
    fetchMarkerList: false
  });
};

// open Modal for TextBox By JY
export const openMarkerTextBoxPopup = (state, action) => {
  const { markerInfoModalvisible } = action;
  console.log("Visible NN", markerInfoModalvisible);
  return state.merge({
    markerInfoModalvisible: markerInfoModalvisible,
  });
};

// open Modal for Photo / Camera By JY
export const openPhotoCameraPopup = (state, action) => {
  const { photoCameraModalVisible } = action;
  return state.merge({
    photoCameraModalVisible: photoCameraModalVisible,
  });
};


// successful api update
export const updateSuccess = (state, action) => {
  // console.log("state********",state);
  console.log('action',action);
  const { imageMarker } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    imageMarker,
    fetchMarkerList: true
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    imageMarker: INITIAL_STATE.imageMarker,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    imageMarker: INITIAL_STATE.imageMarker,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    imageMarkerList: [],
  });
};

// Something went wrong fetching all entities.
export const projectMarkerFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    imageProjectMarkerList: [],
  });
};

// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    imageMarker: state.imageMarker,
    fetchMarkerList: false
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    imageMarker: state.imageMarker,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.IMAGE_MARKER_REQUEST]: request,
  [Types.IMAGE_MARKER_ALL_REQUEST]: allRequest,
  [Types.IMAGE_MARKER_BY_PROJECT_REQUEST]: markerByProjectRequest,
  [Types.IMAGE_MARKER_UPDATE_REQUEST]: updateRequest,
  [Types.IMAGE_MARKER_DELETE_REQUEST]: deleteRequest,

  [Types.IMAGE_MARKER_SUCCESS]: success,
  [Types.IMAGE_MARKER_ALL_SUCCESS]: allSuccess,
  [Types.IMAGE_MARKER_BY_PROJECT_SUCCESS]: projectMarkerSuccess,
  [Types.IMAGE_MARKER_UPDATE_SUCCESS]: updateSuccess,
  [Types.IMAGE_MARKER_DELETE_SUCCESS]: deleteSuccess,

  [Types.IMAGE_MARKER_FAILURE]: failure,
  [Types.IMAGE_MARKER_ALL_FAILURE]: allFailure,
  [Types.IMAGE_MARKER_BY_PROJECT_FAILURE]: projectMarkerFailure,
  [Types.IMAGE_MARKER_UPDATE_FAILURE]: updateFailure,
  [Types.IMAGE_MARKER_DELETE_FAILURE]: deleteFailure,
  [Types.IMAGE_MARKER_RESET]: reset,

  [Types.IMAGE_MARKER_OPT]: projectMarkerSuccess,
  [Types.IMAGE_MARKER_INFO_POPUP]: openMarkerTextBoxPopup, // BY JY
  [Types.PHOTO_CAMERA_POPUP]: openPhotoCameraPopup // BY JY
});
