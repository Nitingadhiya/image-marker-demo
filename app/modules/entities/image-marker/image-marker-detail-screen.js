import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import ImageMarkerActions from './image-marker.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import ImageMarkerDeleteModal from './image-marker-delete-modal';
import styles from './image-marker-styles';

function ImageMarkerDetailScreen(props) {
  const { route, getImageMarker, navigation, imageMarker, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = imageMarker?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('ImageMarker');
      } else {
        setDeleteModalVisible(false);
        getImageMarker(routeEntityId);
      }
    }, [routeEntityId, getImageMarker, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the ImageMarker.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="imageMarkerDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{imageMarker.id}</Text>
      {/* ImageMarkerxPos Field */}
      <Text style={styles.label}>ImageMarkerxPos:</Text>
      <Text testID="imageMarkerxPos">{imageMarker.imageMarkerxPos}</Text>
      {/* ImageMarkeryPos Field */}
      <Text style={styles.label}>ImageMarkeryPos:</Text>
      <Text testID="imageMarkeryPos">{imageMarker.imageMarkeryPos}</Text>
      {/* ImageMarkerDescription Field */}
      <Text style={styles.label}>ImageMarkerDescription:</Text>
      <Text testID="imageMarkerDescription">{imageMarker.imageMarkerDescription}</Text>
      <Text style={styles.label}>Project Image:</Text>
      <Text testID="projectImage">{String(imageMarker.projectImage ? imageMarker.projectImage.id : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('ImageMarkerEdit', { entityId })}
          accessibilityLabel={'ImageMarker Edit Button'}
          testID="imageMarkerEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'ImageMarker Delete Button'}
          testID="imageMarkerDeleteButton"
        />
        {deleteModalVisible && (
          <ImageMarkerDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={imageMarker}
            testID="imageMarkerDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    imageMarker: state.imageMarkers.imageMarker,
    error: state.imageMarkers.errorOne,
    fetching: state.imageMarkers.fetchingOne,
    deleting: state.imageMarkers.deleting,
    errorDeleting: state.imageMarkers.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getImageMarker: (id) => dispatch(ImageMarkerActions.imageMarkerRequest(id)),
    getAllImageMarkers: (options) => dispatch(ImageMarkerActions.imageMarkerAllRequest(options)),
    deleteImageMarker: (id) => dispatch(ImageMarkerActions.imageMarkerDeleteRequest(id)),
    resetImageMarkers: () => dispatch(ImageMarkerActions.imageMarkerReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageMarkerDetailScreen);
