import React, {useState} from 'react';
import { ActivityIndicator, Image, Text, View, Alert, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import ImageMarkerActions from '../image-marker/image-marker.reducer';

import ProjectImageActions from './project-image.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import ProjectImageDeleteModal from './project-image-delete-modal';
import ImageZoom from 'react-native-image-pan-zoom';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import styles from './project-image-marker-styles';


let selectedIndex;
let tempMarker;

// @ts-ignore
function ProjectImageMarkerScreen(props) {
  const {updateImageMarker} = props;
  const {width, height} = Dimensions.get('window');
  const projectImage = props.route.params?.projectImage ?? null;

  const [scale, setScale] = useState('');
  const [addMarker, setAddMarker] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, onChangeText] = useState("");

  const [addedPoints, setPoints] = useState([]);
  const handleClick = (e) => {
    console.log('clicked', e);
      if(addMarker) {
        tempMarker = true;
        let points = [...addedPoints, {
          'x':e.locationX,
          'y':e.locationY,
          'label': addedPoints.length + 1
          }];
          setPoints(points);
          selectedIndex= points.length - 1;
          openBottomSheetPanel(selectedIndex);
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

  const backdropPress = () => {
    if(tempMarker) {
      deleteMarker();
    }
    setModalVisible(false);
  }

  const formValueToEntity = () => {
    console.log("DATA");
    console.log(selectedIndex);
    const length = addedPoints.length - 1;
    console.log(length);
    const entity = {
      "id": null,
      "imageMarkerxPos": addedPoints[length].x, // 394.0078125,
      "imageMarkeryPos": addedPoints[length].y, //281.46875,
      "imageMarkerDescription": description,
      "projectImage": {
        "id": projectImage.project.id,
        "projectImageAwsUrl": projectImage.projectImageAwsUrl, // "https://siteappbucket.s3.eu-central-1.amazonaws.com/floorMap.jpg",
        "projectImageName": projectImage.projectImageName,  //"floorPlanOriginal",
        "projectImageUploadDate": new Date(),
        "project": projectImage.project
      },

      // id: value.id ?? null,
      // imageMarkerxPos: value.imageMarkerxPos ?? null,
      // imageMarkeryPos: value.imageMarkeryPos ?? null,
      // imageMarkerDescription: value.imageMarkerDescription ?? null,
    };
    // entity.projectImage = value.projectImage ? { id: value.projectImage } : null;
    return entity;
  };

  const addDescription = () => {
    console.log("*************");
    console.log(formValueToEntity());
    console.log('-------------')
    updateImageMarker(formValueToEntity())
    setModalVisible(!modalVisible);
  }

  const showBottomSheet = () => {
    return (
      <Modal
      animationIn="slideInUp"
      animationOut="slideOutDown"
      hasBackdrop={true}
      backdropOpacity={0.3}
      isVisible={modalVisible}
      onBackdropPress={() => backdropPress()}
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
              value={description}
              multiline={true}
              placeholderTextColor={'#666'}
              placeholder="Description"
            />
            <RoundedButton
              text="Update"
              onPress={() => addDescription()}
              accessibilityLabel={'Marker Update'}
              testID="markerUpdate"
              style={[styles.button, styles.buttonClose]}
            />
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
    console.log('selectedIndex', selectedIndex);
    console.log("addedPoints", addedPoints);
    let addedPoints1 = addedPoints.splice(selectedIndex, 1);
    console.log('addedPoints', addedPoints);
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
            {/* https://img.parts-catalogs.com/bmw_2020_01/data/JPG/209412.png */}
          <Image
            style={{ width: width, height: width }}
            source={{
              uri: projectImage.projectImageAwsUrl,
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
  return {
    updateImageMarker: (imageMarker) => dispatch(ImageMarkerActions.imageMarkerUpdateRequest(imageMarker)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectImageMarkerScreen);
