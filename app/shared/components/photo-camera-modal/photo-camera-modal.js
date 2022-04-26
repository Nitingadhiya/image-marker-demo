import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";

import { MaterialIcons } from '@expo/vector-icons';
import styles from './photo-camera-modal.styles';

// static propTypes = {
//   title: PropTypes.string,
//   icon: PropTypes.string,
//   style: PropTypes.object,
//   show: PropTypes.bool,
// };

export default function PhotoCameraModal({isVisible,cancel, openImagePicker, openCamera }) {
  return ( 
  <Modal
  animationIn="slideInUp"
  animationOut="slideOutDown"
  hasBackdrop={true}
  backdropOpacity={0.3}
  isVisible={isVisible}
  onBackdropPress={cancel}
  onSwipeComplete={cancel}
  swipeDirection="down"
  style={{marginRight: 0, marginBottom: 0, marginTop: 0}}
  onRequestClose={cancel}
>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={styles.flexRowSections}>
          <TouchableOpacity style={styles.buttonStyle} onPress={openImagePicker}>
            <MaterialIcons name="photo" size={70} color="#2196F3" />
            <Text style={styles.buttonTitle}>Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buttonStyle} onPress={openCamera}>
            <MaterialIcons name="photo-camera" size={70} color="#2196F3" />
            <Text style={styles.buttonTitle}>Camera</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
</Modal>
  )
}
