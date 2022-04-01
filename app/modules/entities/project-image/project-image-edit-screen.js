import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';

import ProjectImageActions from './project-image.reducer';
import ProjectActions from '../project/project.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './project-image-styles';

function ProjectImageEditScreen(props) {
  const {
    getProjectImage,
    updateProjectImage,
    route,
    projectImage,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllProjects,
    projectList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getProjectImage(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getProjectImage, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(projectImage));
    }
  }, [projectImage, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllProjects();
  }, [getAllProjects]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack()
          ? navigation.replace('ProjectImageDetail', { entityId: projectImage?.id })
          : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updateProjectImage(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const projectImageNameRef = createRef();
  const projectImageUploadDateRef = createRef();
  const projectImageAwsUrlRef = createRef();
  const projectRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="projectImageEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="projectImageName"
              ref={projectImageNameRef}
              label="Project Image Name"
              placeholder="Enter Project Image Name"
              testID="projectImageNameInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => projectImageUploadDateRef.current?.focus()}
            />
            <FormField
              name="projectImageUploadDate"
              ref={projectImageUploadDateRef}
              label="Project Image Upload Date"
              placeholder="Enter Project Image Upload Date"
              testID="projectImageUploadDateInput"
              inputType="datetime"
              onSubmitEditing={() => projectImageAwsUrlRef.current?.focus()}
            />
            <FormField
              name="projectImageAwsUrl"
              ref={projectImageAwsUrlRef}
              label="Project Image Aws Url"
              placeholder="Enter Project Image Aws Url"
              testID="projectImageAwsUrlInput"
              inputType="text"
              autoCapitalize="none"
            />
            <FormField
              name="project"
              inputType="select-one"
              ref={projectRef}
              listItems={projectList}
              listItemLabelField="id"
              label="Project"
              placeholder="Select Project"
              testID="projectSelectInput"
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
    projectImageName: value.projectImageName ?? null,
    projectImageUploadDate: value.projectImageUploadDate ?? null,
    projectImageAwsUrl: value.projectImageAwsUrl ?? null,
    project: value.project && value.project.id ? value.project.id : null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    projectImageName: value.projectImageName ?? null,
    projectImageUploadDate: value.projectImageUploadDate ?? null,
    projectImageAwsUrl: value.projectImageAwsUrl ?? null,
  };
  entity.project = value.project ? { id: value.project } : null;
  return entity;
};

const mapStateToProps = (state) => {
  return {
    projectList: state.projects.projectList ?? [],
    projectImage: state.projectImages.projectImage,
    fetching: state.projectImages.fetchingOne,
    updating: state.projectImages.updating,
    updateSuccess: state.projectImages.updateSuccess,
    errorUpdating: state.projectImages.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllProjects: (options) => dispatch(ProjectActions.projectAllRequest(options)),
    getProjectImage: (id) => dispatch(ProjectImageActions.projectImageRequest(id)),
    getAllProjectImages: (options) => dispatch(ProjectImageActions.projectImageAllRequest(options)),
    updateProjectImage: (projectImage) => dispatch(ProjectImageActions.projectImageUpdateRequest(projectImage)),
    reset: () => dispatch(ProjectImageActions.projectImageReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectImageEditScreen);
