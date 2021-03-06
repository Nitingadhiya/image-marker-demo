import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  projectRequest: ['projectId'],
  projectAllRequest: ['options'],
  projectUpdateRequest: ['project'],
  projectDeleteRequest: ['projectId'],

  projectSuccess: ['project'],
  projectAllSuccess: ['projectList', 'headers'],
  projectUpdateSuccess: ['project'],
  projectDeleteSuccess: [],

  projectFailure: ['error'],
  projectAllFailure: ['error'],
  projectUpdateFailure: ['error'],
  projectDeleteFailure: ['error'],

  projectReset: [],
});

export const ProjectTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  project: { id: undefined },
  projectList: [],
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
    project: INITIAL_STATE.project,
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
  const { project } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    project,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { projectList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    projectList: loadMoreDataWhenScrolled(state.projectList, projectList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { project } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    project,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    project: INITIAL_STATE.project,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    project: INITIAL_STATE.project,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    projectList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    project: state.project,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    project: state.project,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PROJECT_REQUEST]: request,
  [Types.PROJECT_ALL_REQUEST]: allRequest,
  [Types.PROJECT_UPDATE_REQUEST]: updateRequest,
  [Types.PROJECT_DELETE_REQUEST]: deleteRequest,

  [Types.PROJECT_SUCCESS]: success,
  [Types.PROJECT_ALL_SUCCESS]: allSuccess,
  [Types.PROJECT_UPDATE_SUCCESS]: updateSuccess,
  [Types.PROJECT_DELETE_SUCCESS]: deleteSuccess,

  [Types.PROJECT_FAILURE]: failure,
  [Types.PROJECT_ALL_FAILURE]: allFailure,
  [Types.PROJECT_UPDATE_FAILURE]: updateFailure,
  [Types.PROJECT_DELETE_FAILURE]: deleteFailure,
  [Types.PROJECT_RESET]: reset,
});
