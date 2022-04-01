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

let selectedIndex;

// @ts-ignore
function ProjectImageMarkerScreen(props) {
  const { route, getProjectImage, navigation, projectImage, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = projectImage?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();


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
      style={{marginRight: 0, marginBottom: 0, marginTop: 0}}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
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

  // const renderAddMarkerButton = () => (
  //   <TouchableOpacity 
  //     onPress={()=>{
  //       setAddMarker(!addMarker);
  //     }} 
  //     style={styles.addMarkerButton}
  //   >
  //   <Text style={styles.addMarkerText}>Add Marker</Text>
  // </TouchableOpacity>
  // );

  // const renderRemoveMarkerButton = () => (
  //   <TouchableOpacity onPress={()=>{
  //     let addedPoints1 = addedPoints.splice(0, 1);
  //     setAddMarker(addedPoints1);
  //     }} 
  //     style={styles.removeMarkerButton}
  //   >
  //   <Text style={styles.addMarkerText}>Remover Marker</Text>
  // </TouchableOpacity>
  // );



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

const styles = StyleSheet.create({
  mainView: {alignItems: 'center', justifyContent: 'center', height: '100%'},
  imagePanView: { position: 'relative', alignSelf: 'center' },
  markerView: {
    zIndex:99999, 
    borderRadius:Dimensions.get('window').width * 0.6 / 14,
    width:Dimensions.get('window').width * 0.6 / 14,
    height:Dimensions.get('window').width * 0.6 / 14,
    backgroundColor:'#333',
    position:'absolute', 
    borderWidth: 2, 
    borderColor: '#fff', 
    shadowColor: "#000",
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,elevation: 5,
  },

  /* Bottom Sheet Style */

  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 22,
  },
  modalView: {
    // margin: 20,
    height: Dimensions.get('window').height,
    backgroundColor: "#1C1C1E",
    // borderRadius: 20,
    paddingTop: 35,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: Dimensions.get('window').width  - 60
  },
  button: {
    borderRadius: 10,
    padding: 15,
    paddingHorizontal: 40,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },

  /* Text Input Style */
  input: {
    height: 110,
    width: '100%',
    margin: 12,
    // borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    color: '#4B4C4E',
    backgroundColor: '#29292B'
  },

  /*add & remove marker button */
  addMarkerButton: { zIndex: 10001, height: 50, width: 100, backgroundColor: '#ffcc00', position: 'absolute', top: 50, right: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center'},
  addMarkerText: { color: '#000', fontSize: 16},
  removeMarkerButton: { zIndex: 10001, height: 50, width: 100, backgroundColor: '#ffcc00', position: 'absolute', top: 50, right: 130, borderRadius: 10, justifyContent: 'center', alignItems: 'center'},
  bottomSections: {flex: 1, alignItems: 'flex-end', flexDirection: 'row', alignSelf: 'flex-end'},
  moveMarker: {
    padding: 10,
  }
});

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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectImageMarkerScreen);
