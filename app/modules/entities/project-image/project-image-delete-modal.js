import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import ProjectImageActions from './project-image.reducer';

import styles from './project-image-styles';

function ProjectImageDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteProjectImage(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('ProjectImage');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete ProjectImage {entity.id}?</Text>
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
    projectImage: state.projectImages.projectImage,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectImageDeleteModal);
