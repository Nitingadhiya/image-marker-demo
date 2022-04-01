import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/image-marker/image-marker.reducer';

test('attempt retrieving a single imageMarker', () => {
  const state = reducer(INITIAL_STATE, Actions.imageMarkerRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.imageMarker).toEqual({ id: undefined });
});

test('attempt retrieving a list of imageMarker', () => {
  const state = reducer(INITIAL_STATE, Actions.imageMarkerAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.imageMarkerList).toEqual([]);
});

test('attempt updating a imageMarker', () => {
  const state = reducer(INITIAL_STATE, Actions.imageMarkerUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a imageMarker', () => {
  const state = reducer(INITIAL_STATE, Actions.imageMarkerDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a imageMarker', () => {
  const state = reducer(INITIAL_STATE, Actions.imageMarkerSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.imageMarker).toEqual({ id: 1 });
});

test('success retrieving a list of imageMarker', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.imageMarkerAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.imageMarkerList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a imageMarker', () => {
  const state = reducer(INITIAL_STATE, Actions.imageMarkerUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.imageMarker).toEqual({ id: 1 });
});
test('success deleting a imageMarker', () => {
  const state = reducer(INITIAL_STATE, Actions.imageMarkerDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.imageMarker).toEqual({ id: undefined });
});

test('failure retrieving a imageMarker', () => {
  const state = reducer(INITIAL_STATE, Actions.imageMarkerFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.imageMarker).toEqual({ id: undefined });
});

test('failure retrieving a list of imageMarker', () => {
  const state = reducer(INITIAL_STATE, Actions.imageMarkerAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.imageMarkerList).toEqual([]);
});

test('failure updating a imageMarker', () => {
  const state = reducer(INITIAL_STATE, Actions.imageMarkerUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.imageMarker).toEqual(INITIAL_STATE.imageMarker);
});
test('failure deleting a imageMarker', () => {
  const state = reducer(INITIAL_STATE, Actions.imageMarkerDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.imageMarker).toEqual(INITIAL_STATE.imageMarker);
});

test('resetting state for imageMarker', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.imageMarkerReset());
  expect(state).toEqual(INITIAL_STATE);
});
