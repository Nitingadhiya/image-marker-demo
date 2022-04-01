import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  projectImageRequest: ['projectImageId'],
  projectImageAllRequest: ['options'],
  projectImageUpdateRequest: ['projectImage'],
  projectImageDeleteRequest: ['projectImageId'],

  projectImageSuccess: ['projectImage'],
  projectImageAllSuccess: ['projectImageList', 'headers'],
  projectImageUpdateSuccess: ['projectImage'],
  projectImageDeleteSuccess: [],

  projectImageFailure: ['error'],
  projectImageAllFailure: ['error'],
  projectImageUpdateFailure: ['error'],
  projectImageDeleteFailure: ['error'],

  projectImageReset: [],
});

export const ProjectImageTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  projectImage: { id: undefined },
  projectImageList: [],
  errorOne: null,
  errorAll: null,
  errorUpdating: null,
  errorDeleting: null,
  links: { next: 0 },
  totalItems: 0,
});

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({
    fetchingOne: true,
    errorOne: false,
    projectImage: INITIAL_STATE.projectImage,
  });

// request the data from an api
export const allRequest = (state) =>
  state.merge({
    fetchingAll: true,
    errorAll: false,
  });

// request to update from an api
export const updateRequest = (state) =>
  state.merge({
    updateSuccess: false,
    updating: true,
  });
// request to delete from an api
export const deleteRequest = (state) =>
  state.merge({
    deleting: true,
  });

// successful api lookup for single entity
export const success = (state, action) => {
  const { projectImage } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    projectImage,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { projectImageList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    projectImageList: loadMoreDataWhenScrolled(state.projectImageList, projectImageList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { projectImage } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    projectImage,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    projectImage: INITIAL_STATE.projectImage,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    projectImage: INITIAL_STATE.projectImage,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    projectImageList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    projectImage: state.projectImage,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    projectImage: state.projectImage,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PROJECT_IMAGE_REQUEST]: request,
  [Types.PROJECT_IMAGE_ALL_REQUEST]: allRequest,
  [Types.PROJECT_IMAGE_UPDATE_REQUEST]: updateRequest,
  [Types.PROJECT_IMAGE_DELETE_REQUEST]: deleteRequest,

  [Types.PROJECT_IMAGE_SUCCESS]: success,
  [Types.PROJECT_IMAGE_ALL_SUCCESS]: allSuccess,
  [Types.PROJECT_IMAGE_UPDATE_SUCCESS]: updateSuccess,
  [Types.PROJECT_IMAGE_DELETE_SUCCESS]: deleteSuccess,

  [Types.PROJECT_IMAGE_FAILURE]: failure,
  [Types.PROJECT_IMAGE_ALL_FAILURE]: allFailure,
  [Types.PROJECT_IMAGE_UPDATE_FAILURE]: updateFailure,
  [Types.PROJECT_IMAGE_DELETE_FAILURE]: deleteFailure,
  [Types.PROJECT_IMAGE_RESET]: reset,
});
