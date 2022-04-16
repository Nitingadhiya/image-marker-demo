import React, {useState} from 'react';
import { Image, Text, View, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import ImageMarkerActions from '../image-marker/image-marker.reducer';
import _ from 'lodash';

import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import ImageZoom from 'react-native-image-pan-zoom';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import styles from './project-image-marker-styles';
import Immutable from 'seamless-immutable'

let imageHeight;
let imageWidth;
let selectedIndex;
let markerPoints = [];
let decription = '';

// @ts-ignore
function ProjectImageMarkerScreen(props) {
  const {
    updateImageMarker, 
    getProjectImageMarkers,
    imageProjectMarkerList,
    imageMarker, 
    OPTImageMarker,
    markerPopupVisible, // 
    isVisible // isVisible
  } = props;
  const projectImage = props.route.params?.projectImage ?? null;
  const [scale, setScale] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      getProjectImageSize();
      selectedIndex = null;
    },[]));

    React.useEffect(() => {
      console.debug('ImageMarker entity changed and the list screen is now in focus, refresh');
      markerPoints = imageProjectMarkerList;
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [imageProjectMarkerList, imageMarker]
  );

  React.useEffect(() => {
      getProjectImageMarkers(projectImage.project.id);
  }, [getProjectImageMarkers]);

  // Get Actual project Image Size
  const getProjectImageSize = () => {
    Image.getSize(projectImage.projectImageAwsUrl, (width, height) => {
      if(width > height) {
        let ratio = width / Dimensions.get('window').width;
        imageWidth = width;
        imageHeight = height /ratio;
      } else {
        let ratio = height / Dimensions.get('window').height;
        imageWidth = width / ratio;
        imageHeight = height;
      }
    });
  }

  //Handle Click Add / Update Marker Info
  const handleClick = (e) => {
    console.log('clicked--', e);
    let points = [...markerPoints, {
      'imageMarkerxPos':e.locationX,
      'imageMarkeryPos':e.locationY,
      'label': markerPoints.length + 1,
      'imageMarkerDescription':''
      }];
    selectedIndex= points.length - 1;
    OPTImageMarker(points);
    openBottomSheetPanel(selectedIndex);   
  };

  const showMarker = () => imageProjectMarkerList && imageProjectMarkerList.length > 0 && imageProjectMarkerList.map( (point, index) => {
    const xyPosition = { top: point.imageMarkeryPos, left: point.imageMarkerxPos };
    const renderSelectedMarkerStyle = () => index == selectedIndex ? {borderWidth: 3, borderColor: '#2196F3'} : {};
    
    return (
      <TouchableOpacity key={`key_${index}`} style={[styles.markerView, renderSelectedMarkerStyle(), xyPosition]} onPress={()=> openBottomSheetPanel(index)}>
        <Text style={{fontSize:10,color: '#fff'}} key={point.imageMarkerxPos}>{point.label ?? index + 1}</Text>
      </TouchableOpacity>
    );
  });

  const openBottomSheetPanel = (index) => {
    decription = '';
    selectedIndex = index;
    markerPopupVisible(true);
  }

  const backdropPress = () => {
    if(selectedIndex != null && markerPoints[selectedIndex].id) {
      markerPopupVisible(false);
    } else{
      deleteMarker();
    }
      
   }

  const formValueToEntity = (val) => {
    const entity = {
      "id": markerPoints[selectedIndex]?.id ?? null,
      "imageMarkerxPos": markerPoints[selectedIndex].imageMarkerxPos, // 394.0078125,
      "imageMarkeryPos": markerPoints[selectedIndex].imageMarkeryPos, //281.46875,
      "imageMarkerDescription": val,
      "projectImage": {
        "id": projectImage.project.id,
        "projectImageAwsUrl": projectImage.projectImageAwsUrl, // "https://siteappbucket.s3.eu-central-1.amazonaws.com/floorMap.jpg",
        "projectImageName": projectImage.projectImageName,  //"floorPlanOriginal",
        "projectImageUploadDate": new Date(),
        "project": projectImage.project
      },

    };
    return entity;
  };

  const addDescription = async () => {
    // console.log(formValueToEntity(decription));
    await updateImageMarker(formValueToEntity(decription))
    markerPopupVisible(false);
    setTimeout(()=>{
      getProjectImageMarkers(projectImage.project.id);
    },1000);
  }

  const showBottomSheet = () => {
    return (
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        hasBackdrop={true}
        backdropOpacity={0.3}
        isVisible={isVisible}
        onBackdropPress={() => backdropPress()}
        onSwipeComplete={() => backdropPress()}
        swipeDirection="down"
        style={{marginRight: 0, marginBottom: 0, marginTop: 0}}
        onRequestClose={() => backdropPress()}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedIndex != null ?
            <TextInput
              style={styles.input}
              onChangeText={(val)=> decription = val}
              defaultValue={markerPoints[selectedIndex]?.imageMarkerDescription}
              multiline={true}
              placeholderTextColor={'#666'}
              placeholder="Enter Description"
            /> : null}
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

  const deleteMarker = async () => {
    markerPopupVisible(false);
    var mutableArray = Immutable.asMutable(markerPoints);
    if(selectedIndex != null && mutableArray[selectedIndex].id) {
      await props.deleteImageMarker(mutableArray[selectedIndex].id);
    }

    mutableArray.splice(selectedIndex,1);
    console.log('selectedIndex',selectedIndex);
    OPTImageMarker(Immutable(mutableArray));
   
    if(selectedIndex >= 0) {
      selectedIndex = null;
    }
  }


  return (
    <View style={styles.mainView}>
      <View style={styles.imagePanView}>
        <ImageZoom
          cropWidth={imageWidth}
          cropHeight={imageHeight}
          panToMove={true}
          minScale={1}
          maxScale={4}
          imageHeight={imageHeight}
          onMove={(e) => setScale(e.scale)}
          imageWidth={imageWidth}
          style={{ marginTop: 0 }}
          onClick={handleClick}>
            {showMarker()}
            {/* https://img.parts-catalogs.com/bmw_2020_01/data/JPG/209412.png */}
          <Image
            style={{ width: imageWidth, height: imageHeight }}
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
  // console.log('state.imageMarkers.errorDeleting', state);
  return {
    imageProjectMarkerList: state.imageMarkers.imageProjectMarkerList,
    imageMarker: state.imageMarkers.imageMarker,
    fetching: state.imageMarkers.fetchingAll,
    isVisible: state.imageMarkers.markerInfoModalvisible
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProjectImageMarkers: (id) => dispatch(ImageMarkerActions.imageMarkerByProjectRequest(id)),
    updateImageMarker: (imageMarker) => dispatch(ImageMarkerActions.imageMarkerUpdateRequest(imageMarker)),
    deleteImageMarker: (id) => dispatch(ImageMarkerActions.imageMarkerDeleteRequest(id)),
    OPTImageMarker: (data) =>  dispatch(ImageMarkerActions.imageMarkerOPT(data)),
    markerPopupVisible: (data) => dispatch(ImageMarkerActions.imageMarkerInfoPopup(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectImageMarkerScreen);

