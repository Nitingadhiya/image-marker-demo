import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import ProjectImageSagas from '../../../../../app/modules/entities/project-image/project-image.sagas';
import ProjectImageActions from '../../../../../app/modules/entities/project-image/project-image.reducer';

const { getProjectImage, getAllProjectImages, updateProjectImage, deleteProjectImage } = ProjectImageSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getProjectImage(1);
  const step = stepper(getProjectImage(FixtureAPI, { projectImageId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(ProjectImageActions.projectImageSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getProjectImage(FixtureAPI, { projectImageId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(ProjectImageActions.projectImageFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllProjectImages();
  const step = stepper(getAllProjectImages(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(ProjectImageActions.projectImageAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllProjectImages(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(ProjectImageActions.projectImageAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateProjectImage({ id: 1 });
  const step = stepper(updateProjectImage(FixtureAPI, { projectImage: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(ProjectImageActions.projectImageUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateProjectImage(FixtureAPI, { projectImage: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(ProjectImageActions.projectImageUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteProjectImage({ id: 1 });
  const step = stepper(deleteProjectImage(FixtureAPI, { projectImageId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(ProjectImageActions.projectImageDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteProjectImage(FixtureAPI, { projectImageId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(ProjectImageActions.projectImageDeleteFailure()));
});
