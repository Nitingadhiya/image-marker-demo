import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';

import ImageMarkerActions from './image-marker.reducer';
import ProjectImageActions from '../project-image/project-image.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './image-marker-styles';

function ImageMarkerEditScreen(props) {
  const {
    getImageMarker,
    updateImageMarker,
    route,
    imageMarker,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllProjectImages,
    projectImageList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getImageMarker(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getImageMarker, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(imageMarker));
    }
  }, [imageMarker, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllProjectImages();
  }, [getAllProjectImages]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('ImageMarkerDetail', { entityId: imageMarker?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updateImageMarker(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const imageMarkerxPosRef = createRef();
  const imageMarkeryPosRef = createRef();
  const imageMarkerDescriptionRef = createRef();
  const projectImageRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="imageMarkerEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="imageMarkerxPos"
              ref={imageMarkerxPosRef}
              label="Image Markerx Pos"
              placeholder="Enter Image Markerx Pos"
              testID="imageMarkerxPosInput"
              inputType="number"
              onSubmitEditing={() => imageMarkeryPosRef.current?.focus()}
            />
            <FormField
              name="imageMarkeryPos"
              ref={imageMarkeryPosRef}
              label="Image Markery Pos"
              placeholder="Enter Image Markery Pos"
              testID="imageMarkeryPosInput"
              inputType="number"
              onSubmitEditing={() => imageMarkerDescriptionRef.current?.focus()}
            />
            <FormField
              name="imageMarkerDescription"
              ref={imageMarkerDescriptionRef}
              label="Image Marker Description"
              placeholder="Enter Image Marker Description"
              testID="imageMarkerDescriptionInput"
              inputType="text"
              autoCapitalize="none"
            />
            <FormField
              name="projectImage"
              inputType="select-one"
              ref={projectImageRef}
              listItems={projectImageList}
              listItemLabelField="id"
              label="Project Image"
              placeholder="Select Project Image"
              testID="projectImageSelectInput"
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
    imageMarkerxPos: value.imageMarkerxPos ?? null,
    imageMarkeryPos: value.imageMarkeryPos ?? null,
    imageMarkerDescription: value.imageMarkerDescription ?? null,
    projectImage: value.projectImage && value.projectImage.id ? value.projectImage.id : null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    imageMarkerxPos: value.imageMarkerxPos ?? null,
    imageMarkeryPos: value.imageMarkeryPos ?? null,
    imageMarkerDescription: value.imageMarkerDescription ?? null,
  };
  entity.projectImage = value.projectImage ? { id: value.projectImage } : null;
  return entity;
};

const mapStateToProps = (state) => {
  return {
    projectImageList: state.projectImages.projectImageList ?? [],
    imageMarker: state.imageMarkers.imageMarker,
    fetching: state.imageMarkers.fetchingOne,
    updating: state.imageMarkers.updating,
    updateSuccess: state.imageMarkers.updateSuccess,
    errorUpdating: state.imageMarkers.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllProjectImages: (options) => dispatch(ProjectImageActions.projectImageAllRequest(options)),
    getImageMarker: (id) => dispatch(ImageMarkerActions.imageMarkerRequest(id)),
    getAllImageMarkers: (options) => dispatch(ImageMarkerActions.imageMarkerAllRequest(options)),
    updateImageMarker: (imageMarker) => dispatch(ImageMarkerActions.imageMarkerUpdateRequest(imageMarker)),
    reset: () => dispatch(ImageMarkerActions.imageMarkerReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageMarkerEditScreen);
