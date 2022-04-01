import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import PhotoActions from './photo.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import PhotoDeleteModal from './photo-delete-modal';
import styles from './photo-styles';

function PhotoDetailScreen(props) {
  const { route, getPhoto, navigation, photo, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = photo?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Photo');
      } else {
        setDeleteModalVisible(false);
        getPhoto(routeEntityId);
      }
    }, [routeEntityId, getPhoto, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Photo.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="photoDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{photo.id}</Text>
      {/* PhotoName Field */}
      <Text style={styles.label}>PhotoName:</Text>
      <Text testID="photoName">{photo.photoName}</Text>
      {/* PhotoUploadDate Field */}
      <Text style={styles.label}>PhotoUploadDate:</Text>
      <Text testID="photoUploadDate">{String(photo.photoUploadDate)}</Text>
      <Text style={styles.label}>Image Marker:</Text>
      <Text testID="imageMarker">{String(photo.imageMarker ? photo.imageMarker.id : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('PhotoEdit', { entityId })}
          accessibilityLabel={'Photo Edit Button'}
          testID="photoEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Photo Delete Button'}
          testID="photoDeleteButton"
        />
        {deleteModalVisible && (
          <PhotoDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={photo}
            testID="photoDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    photo: state.photos.photo,
    error: state.photos.errorOne,
    fetching: state.photos.fetchingOne,
    deleting: state.photos.deleting,
    errorDeleting: state.photos.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPhoto: (id) => dispatch(PhotoActions.photoRequest(id)),
    getAllPhotos: (options) => dispatch(PhotoActions.photoAllRequest(options)),
    deletePhoto: (id) => dispatch(PhotoActions.photoDeleteRequest(id)),
    resetPhotos: () => dispatch(PhotoActions.photoReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetailScreen);
