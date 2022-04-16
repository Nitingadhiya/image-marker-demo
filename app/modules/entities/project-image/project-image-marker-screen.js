import React, {useState, useRef} from 'react';
import { ActivityIndicator, Image, Text, View, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import ImageMarkerActions from '../image-marker/image-marker.reducer';
import _ from 'lodash';

import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import ImageZoom from 'react-native-image-pan-zoom';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import styles from './project-image-marker-styles';

import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import { put } from 'redux-saga/effects';
import Immutable from 'seamless-immutable'


let selectedIndex;
let tempMarker;
let backPress = false;

let imageHeight;
let imageWidth;

let tempPoints = [];
let txtInpValueChange = false;
// @ts-ignore
function ProjectImageMarkerScreen(props) {
  const {updateImageMarker, getProjectImageMarkers,
    imageProjectMarkerList,imageMarker, 
    imageMarkerDeleteSuccess, fetching,
    OPTImageMarker,
    markerPopupVisible,
    visible
  } = props;
  const {width, height} = Dimensions.get('window');
  const projectImage = props.route.params?.projectImage ?? null;

  const [scale, setScale] = useState('');
  const [addMarker, setAddMarker] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, onChangeText] = useState("");

const textInputRef = React.createRef();

  useFocusEffect(
    React.useCallback(() => {
      getProjectImageSize();
      selectedIndex = null;
    },[]));

    React.useEffect(() => {
      console.log('props', props);
      console.debug('ImageMarker entity changed and the list screen is now in focus, refresh');
      // console.log(props.imageProjectMarkerList);
      // setPoints(imageProjectMarkerList);
      tempPoints = imageProjectMarkerList;
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [imageProjectMarkerList, imageMarker]
  );

  React.useEffect(() => {
      getProjectImageMarkers(projectImage.project.id);
  }, [getProjectImageMarkers]);

  // React.useEffect(() => {
  //  if (!fetching) {
  //   getProjectImageMarkers(projectImage.project.id);
  //   }
  // }, [projectImage]);
  

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

  // const [addedPoints, setPoints] = useState([]);
  const handleClick = (e) => {
    console.log('clicked--', e);
     // if(addMarker) {
        tempMarker = true;
        console.log("CKICI");
        let points = [...tempPoints, {
          'imageMarkerxPos':e.locationX,
          'imageMarkeryPos':e.locationY,
          'label': tempPoints.length + 1,
          'imageMarkerDescription':''
          }];

          // console.log(points);
          selectedIndex= points.length - 1;
          OPTImageMarker(points);
          // setPoints(points);
          
          openBottomSheetPanel(selectedIndex);
     // }   
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
    console.log("iiii")
    selectedIndex = index;
    console.log("index");
   
    markerPopupVisible(true);
    // textInputRef.current='asd';
  }

  const backdropPress = () => {
    backPress = true;
      deleteMarker();
   }

  const formValueToEntity = (val) => {
    const entity = {
      "id": tempPoints[selectedIndex]?.id ?? null,
      "imageMarkerxPos": tempPoints[selectedIndex].imageMarkerxPos, // 394.0078125,
      "imageMarkeryPos": tempPoints[selectedIndex].imageMarkeryPos, //281.46875,
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

    console.log('selectedIndex',selectedIndex);
    const val = textInputRef.current.value

    console.log(formValueToEntity(val));
    await updateImageMarker(formValueToEntity(val))
    markerPopupVisible(false);
    // setModalVisible(!modalVisible);
    // selectedIndex = null;
    setTimeout(()=>{
      getProjectImageMarkers(projectImage.project.id);
    },1000);
    // 
  }

  const setChangeText = (val) => {
    console.log('selectedIndex', selectedIndex);
    console.log("tempPoints",tempPoints);
    console.log('val', val);
    if(selectedIndex > -1) {
      var mutableArray = Immutable.asMutable(tempPoints, {deep: true});
      console.log('mutableArray',mutableArray);
      // let ind = mutableArray[selectedIndex];
      //  ind = {
      //    ...mutableArray[selectedIndex],
      //    'imageMarkerDescription': 'ABC'
      //  };
      mutableArray[selectedIndex].imageMarkerDescription = val;
      console.log("MUUTU", mutableArray);
      OPTImageMarker(Immutable(mutableArray));
    //  var da = Immutable.set(tempPoints[2],"imageMarkerDescription", 'Looks');
    //   console.log('tempPoints,,',da);

//       var obj = Immutable({type: "parrot", subtype: "Norwegian Blue", status: "alive"});
//         var da = Immutable.merge(obj, {status: "dead"});

// console.log("OBJ", da);



        // console.log('mutableArray after ',mutableArray);
      // OPTImageMarker(Immutable(mutableArray));
    //  props.imageProjectMarkerList[selectedIndex].imageMarkerDescription = '';
      // changeT[selectedIndex]['imageMarkerDescription'] = '';
      // console.log('tempPoints after',tempPoints)
      // OPTImageMarker(tempPoints);
    }
    // txtInpValueChange = true;
    // onChangeText(val) 
  }

  const showBottomSheet = () => {
    return (
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        hasBackdrop={true}
        backdropOpacity={0.3}
        isVisible={visible}
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
              ref={textInputRef}
              defaultValue={tempPoints[selectedIndex]?.imageMarkerDescription}
              // onChangeText={setChangeText}
              //value={tempPoints[selectedIndex]?.imageMarkerDescription}
              multiline={true}
              placeholderTextColor={'#666'}
              placeholder="Description"
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
    console.log("MARKEKR")
    markerPopupVisible(false);

    // var obj = Immutable({all: "your base", are: {belong: "to them"}});
    // Immutable.merge(obj, {are: {belong: "to us"}})
    //   console.log('obj',obj);
      var mutableArray = Immutable.asMutable(tempPoints);
      console.log('mutableArray',mutableArray);
    if(selectedIndex != null && mutableArray[selectedIndex].id) {
      await props.deleteImageMarker(mutableArray[selectedIndex].id);
    }

      mutableArray.splice(selectedIndex,1);
      console.log('mutableArray after',mutableArray);
    // Immutable.asMutable(tempPoints, {deep: true})
    // tempPoints.splice(selectedIndex,1);
    console.log('selectedIndex',selectedIndex);
    OPTImageMarker(Immutable(mutableArray));

    // yield put(ImageMarkerActions.imageMarkerByProjectSuccess(response.data));
    // yield put(ImageMarkerActions.imageMarkerByProjectSuccess([]));
    // Here BackPress 
    // Used common function for delete Marker, Only new added Marker delete from locally.

    // console.log(addedPoints);
    // console.log(selectedIndex,'selectedIndex--')
    // console.log(backPress,'backPress--')

    // const result = addedPoints.filter((_, i) => {
    //   console.log(i+'----', i !== selectedIndex);
    //   return i !== selectedIndex
    // });
    // console.log('result', result);
    // setPoints(result);

    // if(addedPoints[selectedIndex] != null && addedPoints[selectedIndex].id) {
    //   console.log('addedPoints[selectedIndex].id', addedPoints[selectedIndex].id);
    // let poll =  await props.deleteImageMarker(addedPoints[selectedIndex].id);
    // console.log('poll', poll);
    // }
    
    // setTimeout(()=>{
    //   getProjectImageMarkers(projectImage.project.id);
    // },1000);
    
    // backPress = false;
   
    if(selectedIndex >= 0) {
      // let addedPoints1 = tempArr.splice(selectedIndex, 1);
      // setAddMarker(addedPoints1);
     // setModalVisible(false);
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
  console.log('state.imageMarkers.errorDeleting', state);
  return {
    imageProjectMarkerList: state.imageMarkers.imageProjectMarkerList,
    imageMarker: state.imageMarkers.imageMarker,
    fetching: state.imageMarkers.fetchingAll,
    imageMarkerDeleteSuccess: state.imageMarkers.errorDeleting ? state.imageMarkers.errorDeleting : false,
    visible: state.imageMarkers.markerInfoModalvisible
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProjectImageMarkers: (id) => dispatch(ImageMarkerActions.imageMarkerByProjectRequest(id)),
    updateImageMarker: (imageMarker) => dispatch(ImageMarkerActions.imageMarkerUpdateRequest(imageMarker)),
    deleteImageMarker: (id) => dispatch(ImageMarkerActions.imageMarkerDeleteRequest(id)),
    OPTImageMarker: (data) => {
      console.log(data);
      return dispatch(ImageMarkerActions.imageMarkerOPT(data));
    },
    markerPopupVisible: (data) => dispatch(ImageMarkerActions.imageMarkerInfoPopup(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectImageMarkerScreen);
