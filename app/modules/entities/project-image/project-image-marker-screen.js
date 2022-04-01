import React, {useState} from 'react';
import { ActivityIndicator, Image, Text, View, Alert, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import ProjectImageActions from './project-image.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import ProjectImageDeleteModal from './project-image-delete-modal';
import ImageZoom from 'react-native-image-pan-zoom';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import styles from './project-image-marker-styles';

let selectedIndex;

// @ts-ignore
function ProjectImageMarkerScreen(props) {
  const {width, height} = Dimensions.get('window');

  const [scale, setScale] = useState('');
  const [addMarker, setAddMarker] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState("");

  const [addedPoints, setPoints] = useState([]);
  const handleClick = (e) => {
    console.log('clicked', e);
      if(addMarker) {
        let points = [{
          'x':e.locationX,
          'y':e.locationY,
          'label': addedPoints.length + 1
          }, ...addedPoints];
          setPoints(points);
      }   
  };

  const showMarker = () => addedPoints.map( (point, index) => {
    const xyPosition = { top: point.y, left: point.x };
    return (
      <TouchableOpacity key={point.x} style={[styles.markerView, xyPosition]} onPress={()=> openBottomSheetPanel(index)}>
        <Text style={{fontSize:10,color: '#fff'}} key={point.x}>{point.label}</Text>
      </TouchableOpacity>
    );
  });

  const openBottomSheetPanel = (index) => {
    selectedIndex = index;
    setModalVisible(true);
  }

  const showBottomSheet = () => {
    return (
      <Modal
      animationIn="slideInRight"
        animationOut="slideOutRight"
      hasBackdrop={false}
      isVisible={modalVisible}
      onSwipeComplete={() => setModalVisible(false)}
      swipeDirection="right"
      style={{marginRight: 0, marginBottom: 0, marginTop: 0}}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              multiline={true}
              placeholderTextColor={'#4B4C4E'}
              placeholder="Description"
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Update</Text>
            </TouchableOpacity>
            <View style={styles.bottomSections}>
              <TouchableOpacity style={styles.moveMarker}>
                <MaterialIcons name="location-searching" size={30} color="#2196F3" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.moveMarker} onPress={()=> deleteMarker()}>
                <MaterialIcons name="delete-outline" size={30} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </Modal>
    )
  };

  const deleteMarker = () => {
    let addedPoints1 = addedPoints.splice(selectedIndex, 1);
    setAddMarker(addedPoints1);
    setModalVisible(false);
  }

  return (
    <View style={styles.mainView}>
      {/* {renderAddMarkerButton()} */}
      {/* {renderRemoveMarkerButton()} */}

      <View style={styles.imagePanView}>
        <ImageZoom
          cropWidth={width}
          cropHeight={height}
          panToMove={true}
          minScale={1}
          maxScale={4}
          imageHeight={width}
          onMove={(e) => setScale(e.scale)}
          imageWidth={width}
          style={{ marginTop: 0 }}
          onClick={handleClick}>
            {showMarker()}
          <Image
            style={{ width: width, height: width }}
            source={{
              uri: `https://img.parts-catalogs.com/bmw_2020_01/data/JPG/209412.png`,
            }}
            resizeMode="contain"
          />
        </ImageZoom>
      </View>
      {showBottomSheet()}
    </View>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectImageMarkerScreen);
