import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import ImageMarkerSagas from '../../../../../app/modules/entities/image-marker/image-marker.sagas';
import ImageMarkerActions from '../../../../../app/modules/entities/image-marker/image-marker.reducer';

const { getImageMarker, getAllImageMarkers, updateImageMarker, deleteImageMarker } = ImageMarkerSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getImageMarker(1);
  const step = stepper(getImageMarker(FixtureAPI, { imageMarkerId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(ImageMarkerActions.imageMarkerSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getImageMarker(FixtureAPI, { imageMarkerId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(ImageMarkerActions.imageMarkerFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllImageMarkers();
  const step = stepper(getAllImageMarkers(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(ImageMarkerActions.imageMarkerAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllImageMarkers(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(ImageMarkerActions.imageMarkerAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateImageMarker({ id: 1 });
  const step = stepper(updateImageMarker(FixtureAPI, { imageMarker: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(ImageMarkerActions.imageMarkerUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateImageMarker(FixtureAPI, { imageMarker: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(ImageMarkerActions.imageMarkerUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteImageMarker({ id: 1 });
  const step = stepper(deleteImageMarker(FixtureAPI, { imageMarkerId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(ImageMarkerActions.imageMarkerDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteImageMarker(FixtureAPI, { imageMarkerId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(ImageMarkerActions.imageMarkerDeleteFailure()));
});
