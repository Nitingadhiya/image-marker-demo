import React from 'react';
import { ActivityIndicator, ScrollView, Text, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import ProjectImageActions from './project-image.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import ProjectImageDeleteModal from './project-image-delete-modal';
import styles from './project-image-styles';

const SimpleAlert = () => {
  Alert.alert(
    'Info Message',
    'Open new view and display the image of the {projectImage.projectImageAwsUrl} ',
    [{ text: 'Close', onPress: () => console.log('No button clicked'), style: 'cancel' }],
    {
      cancelable: true,
    },
  );
};

// @ts-ignore
function ProjectImageDetailScreen(props) {
  const { route, getProjectImage, navigation, projectImage, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = projectImage?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('ProjectImage');
      } else {
        setDeleteModalVisible(false);
        getProjectImage(routeEntityId);
      }
    }, [routeEntityId, getProjectImage, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the ProjectImage.</Text>
      </View>
    );
  }
  if (!entityId || fetching || !correctEntityLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="projectImageDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{projectImage.id}</Text>
      {/* ProjectImageName Field */}
      <Text style={styles.label}>ProjectImageName:</Text>
      <Text testID="projectImageName">{projectImage.projectImageName}</Text>
      {/* ProjectImageUploadDate Field */}
      <Text style={styles.label}>ProjectImageUploadDate:</Text>
      <Text testID="projectImageUploadDate">{String(projectImage.projectImageUploadDate)}</Text>
      {/* ProjectImageAwsUrl Field */}
      <Text style={styles.label}>ProjectImageAwsUrl:</Text>
      <Text testID="projectImageAwsUrl">{projectImage.projectImageAwsUrl}</Text>
      <Text style={styles.label}>Project:</Text>
      <Text testID="project">{String(projectImage.project ? projectImage.project.id : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('ProjectImageEdit', { entityId })}
          accessibilityLabel={'ProjectImage Edit Button'}
          testID="projectImageEditButton"
        />
         <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('ProjectImageEdit', { entityId })}
          accessibilityLabel={'ProjectImage Edit Button'}
          testID="projectImageEditButton"
        />
        <RoundedButton
          text="Show Image and Add Markers"
          onPress={() => {
            navigation.navigate('ProjectImageMarker', { entityId });
          }}
          accessibilityLabel={'ProjectImage Add Marker Button'}
          testID="projectImageAddMarkerButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'ProjectImage Delete Button'}
          testID="projectImageDeleteButton"
        />
        {deleteModalVisible && (
          <ProjectImageDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={projectImage}
            testID="projectImageDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    projectImage: state.projectImages.projectImage,
    error: state.projectImages.errorOne,
    fetching: state.projectImages.fetchingOne,
    deleting: state.projectImages.deleting,
    errorDeleting: state.projectImages.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProjectImage: (id) => dispatch(ProjectImageActions.projectImageRequest(id)),
    getAllProjectImages: (options) => dispatch(ProjectImageActions.projectImageAllRequest(options)),
    deleteProjectImage: (id) => dispatch(ProjectImageActions.projectImageDeleteRequest(id)),
    resetProjectImages: () => dispatch(ProjectImageActions.projectImageReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectImageDetailScreen);
