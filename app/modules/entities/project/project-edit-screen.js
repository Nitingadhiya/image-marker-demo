import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';

import ProjectActions from './project.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './project-styles';

function ProjectEditScreen(props) {
  const { getProject, updateProject, route, project, fetching, updating, errorUpdating, updateSuccess, navigation, reset } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getProject(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getProject, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(project));
    }
  }, [project, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {}, []);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('ProjectDetail', { entityId: project?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updateProject(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const projectNameRef = createRef();
  const projectStartDateRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="projectEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="projectName"
              ref={projectNameRef}
              label="Project Name"
              placeholder="Enter Project Name"
              testID="projectNameInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => projectStartDateRef.current?.focus()}
            />
            <FormField
              name="projectStartDate"
              ref={projectStartDateRef}
              label="Project Start Date"
              placeholder="Enter Project Start Date"
              testID="projectStartDateInput"
              inputType="datetime"
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
    projectName: value.projectName ?? null,
    projectStartDate: value.projectStartDate ?? null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    projectName: value.projectName ?? null,
    projectStartDate: value.projectStartDate ?? null,
  };
  return entity;
};

const mapStateToProps = (state) => {
  return {
    project: state.projects.project,
    fetching: state.projects.fetchingOne,
    updating: state.projects.updating,
    updateSuccess: state.projects.updateSuccess,
    errorUpdating: state.projects.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProject: (id) => dispatch(ProjectActions.projectRequest(id)),
    getAllProjects: (options) => dispatch(ProjectActions.projectAllRequest(options)),
    updateProject: (project) => dispatch(ProjectActions.projectUpdateRequest(project)),
    reset: () => dispatch(ProjectActions.projectReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectEditScreen);
