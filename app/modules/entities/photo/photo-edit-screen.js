import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';

import PhotoActions from './photo.reducer';
import ImageMarkerActions from '../image-marker/image-marker.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './photo-styles';

function PhotoEditScreen(props) {
  const {
    getPhoto,
    updatePhoto,
    route,
    photo,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllImageMarkers,
    imageMarkerList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getPhoto(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getPhoto, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(photo));
    }
  }, [photo, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllImageMarkers();
  }, [getAllImageMarkers]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('PhotoDetail', { entityId: photo?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updatePhoto(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const photoNameRef = createRef();
  const photoUploadDateRef = createRef();
  const imageMarkerRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="photoEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="photoName"
              ref={photoNameRef}
              label="Photo Name"
              placeholder="Enter Photo Name"
              testID="photoNameInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => photoUploadDateRef.current?.focus()}
            />
            <FormField
              name="photoUploadDate"
              ref={photoUploadDateRef}
              label="Photo Upload Date"
              placeholder="Enter Photo Upload Date"
              testID="photoUploadDateInput"
              inputType="datetime"
            />
            <FormField
              name="imageMarker"
              inputType="select-one"
              ref={imageMarkerRef}
              listItems={imageMarkerList}
              listItemLabelField="id"
              label="Image Marker"
              placeholder="Select Image Marker"
              testID="imageMarkerSelectInput"
            />

            <FormButton title={'Save'} testID={'submitButton'} />
          </Form>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

// convenience methods for customizing the mapping of the entity to/from the form value
const entityToFormValue = (value) => {
  if (!value) {
    return {};
  }
  return {
    id: value.id ?? null,
    photoName: value.photoName ?? null,
    photoUploadDate: value.photoUploadDate ?? null,
    imageMarker: value.imageMarker && value.imageMarker.id ? value.imageMarker.id : null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    photoName: value.photoName ?? null,
    photoUploadDate: value.photoUploadDate ?? null,
  };
  entity.imageMarker = value.imageMarker ? { id: value.imageMarker } : null;
  return entity;
};

const mapStateToProps = (state) => {
  return {
    imageMarkerList: state.imageMarkers.imageMarkerList ?? [],
    photo: state.photos.photo,
    fetching: state.photos.fetchingOne,
    updating: state.photos.updating,
    updateSuccess: state.photos.updateSuccess,
    errorUpdating: state.photos.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllImageMarkers: (options) => dispatch(ImageMarkerActions.imageMarkerAllRequest(options)),
    getPhoto: (id) => dispatch(PhotoActions.photoRequest(id)),
    getAllPhotos: (options) => dispatch(PhotoActions.photoAllRequest(options)),
    updatePhoto: (photo) => dispatch(PhotoActions.photoUpdateRequest(photo)),
    reset: () => dispatch(PhotoActions.photoReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoEditScreen);
