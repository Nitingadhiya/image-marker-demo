import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/project-image/project-image.reducer';

test('attempt retrieving a single projectImage', () => {
  const state = reducer(INITIAL_STATE, Actions.projectImageRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.projectImage).toEqual({ id: undefined });
});

test('attempt retrieving a list of projectImage', () => {
  const state = reducer(INITIAL_STATE, Actions.projectImageAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.projectImageList).toEqual([]);
});

test('attempt updating a projectImage', () => {
  const state = reducer(INITIAL_STATE, Actions.projectImageUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a projectImage', () => {
  const state = reducer(INITIAL_STATE, Actions.projectImageDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a projectImage', () => {
  const state = reducer(INITIAL_STATE, Actions.projectImageSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.projectImage).toEqual({ id: 1 });
});

test('success retrieving a list of projectImage', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.projectImageAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.projectImageList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a projectImage', () => {
  const state = reducer(INITIAL_STATE, Actions.projectImageUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.projectImage).toEqual({ id: 1 });
});
test('success deleting a projectImage', () => {
  const state = reducer(INITIAL_STATE, Actions.projectImageDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.projectImage).toEqual({ id: undefined });
});

test('failure retrieving a projectImage', () => {
  const state = reducer(INITIAL_STATE, Actions.projectImageFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.projectImage).toEqual({ id: undefined });
});

test('failure retrieving a list of projectImage', () => {
  const state = reducer(INITIAL_STATE, Actions.projectImageAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.projectImageList).toEqual([]);
});

test('failure updating a projectImage', () => {
  const state = reducer(INITIAL_STATE, Actions.projectImageUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.projectImage).toEqual(INITIAL_STATE.projectImage);
});
test('failure deleting a projectImage', () => {
  const state = reducer(INITIAL_STATE, Actions.projectImageDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.projectImage).toEqual(INITIAL_STATE.projectImage);
});

test('resetting state for projectImage', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.projectImageReset());
  expect(state).toEqual(INITIAL_STATE);
});
