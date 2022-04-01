import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import ImageMarkerActions from './image-marker.reducer';

import styles from './image-marker-styles';

function ImageMarkerDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteImageMarker(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('ImageMarker');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete ImageMarker {entity.id}?</Text>
          </View>
          <View style={[styles.flexRow]}>
            <TouchableHighlight
              style={[styles.openButton, styles.cancelButton]}
              onPress={() => {
                setVisible(false);
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.openButton, styles.submitButton]} onPress={deleteEntity} testID="deleteButton">
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const mapStateToProps = (state) => {
  return {
    imageMarker: state.imageMarkers.imageMarker,
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

export default connect(mapStateToProps, mapDispatchToProps)(ImageMarkerDeleteModal);
