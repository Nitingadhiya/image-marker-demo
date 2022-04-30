import React, {useState} from 'react';
import { Image, Text, View, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
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


import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types';
import { Buffer } from "buffer";
import { RNS3 } from 'react-native-aws3';
import PhotoActions from '../photo/photo.reducer';
import PhotoCameraModal from '../../../shared/components/photo-camera-modal/photo-camera-modal';
import AwsConfig from "../../../../aws-config.json";


let imageHeight;
let imageWidth;
let selectedIndex;
let markerPoints = [];
let descriptionVal = '';
let s3ImageObj;
let markerValueUpdated = false; // If user change something then Value will be changed
let markerImageArray = [];

// @ts-ignore
function ProjectImageMarkerScreen(props) {
  const {
    updateImageMarker, 
    getProjectImageMarkers,
    imageProjectMarkerList,
    imageMarker, 
    OPTImageMarker,
    markerPopupVisible, // 
    isVisible, // isVisible for Marker Modal
    isVisiblePhotoCameraModal, // For Camera / photo
    photoCameraPopupVisible, // For Camera / photo
    updatePhoto,
    fetchMarkerList,
  } = props;
  const projectImage = props.route.params?.projectImage ?? null;
  const [scale, setScale] = useState('');
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [multipleImageState, setMultipleImageForMarker] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      markerPopupVisible(false);
      getProjectImageSize();
      selectedIndex = null;
    },[]));

    React.useEffect(() => {
      console.debug('ImageMarker entity changed and the list screen is now in focus, refresh');
      markerPoints = imageProjectMarkerList;
      console.log(markerPoints);
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [imageProjectMarkerList, imageMarker]
  );

  React.useEffect(() => {
      getProjectImageMarkers(projectImage.project.id);
  }, [getProjectImageMarkers]);

  React.useEffect(() => {
    if(fetchMarkerList){
      console.log("Verify", imageMarker);
      console.log("Verify*", imageMarker.id);
      updateMarkerLocalArray(imageMarker);
      createPhotoWithMarker(imageMarker.id);
      // getProjectImageMarkers(project createPhotoWithMarker(markerId) createPhotoWithMarker(markerId));
    }
}, [fetchMarkerList]);


const updateMarkerLocalArray = (imageMarker) => {
  var mutableArray = Immutable.asMutable(markerPoints);
  mutableArray[mutableArray.length - 1] = imageMarker;
  OPTImageMarker(Immutable(mutableArray));
}

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
  const handleClick = async (e) => {
    // Confirmation Popup (discard changes /stay with current marker),IF user by mistake click on another marker or background image
   if(markerValueUpdated && ! await changeDiscard()){
     return false;
   }
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
      <TouchableOpacity key={`key_${index}`} style={[styles.markerView, renderSelectedMarkerStyle(), xyPosition]} onPress={()=> selectExistingMarker(index)}>
        <Text style={{fontSize:10,color: '#fff'}} key={point.imageMarkerxPos}>{point.label ?? index + 1}</Text>
      </TouchableOpacity>
    );
  });

  const selectExistingMarker = async (index) => {
    if(index == selectedIndex) return;
    if(await manageMarker(index)) {
      openBottomSheetPanel(index);
    }   
  }
  const manageMarker = async (index) => {
    // Confirmation Popup (discard changes /stay with current marker),IF user by mistake click on another marker or background image
    return new Promise(async (resolve, reject) => {
       var mutableArray = Immutable.asMutable(markerPoints);
    if(mutableArray[mutableArray.length - 1].id == undefined) {
      Alert.alert(
        "Discard",
        "Are you sure you want to discard changes?",
          [
            {
                text: "Cancel",
                onPress: () => {
                  console.log("Cancel Pressed");
                   resolve(false);
                },
                style: "cancel"
              },
              {
                text: 'OK', onPress: () => {
                resolve(true);
                mutableArray.splice(markerPoints.length - 1,1);
                OPTImageMarker(Immutable(mutableArray));
              },
            }
          ],
          { cancelable: false }
      );
    } else {
      // Existing Marker
      if(markerValueUpdated && markerPoints[index]['imageMarkerDescription'] !== descriptionVal) {
        if(await changeDiscard(index)){
          markerValueUpdated = false;
          resolve(true);
        } else {
          resolve(false);
        }
      } else{
        resolve(true);
      }
     
    }
  })
  }

  const changeDiscard = ()=>{
    // If user changes on Existing marker and then clicks on other Existing marker
    // Confirmation Popup (discard changes /stay with current marker),IF user by mistake click on another marker or background image
    return new Promise((resolve, reject) => {
      Alert.alert(
        "Discard",
        "Are you sure you want to discard changes?",
          [
            {
                text: "Cancel",
                onPress: () => {
                  console.log("Cancel Pressed");
                  resolve(false);
                },
                style: "cancel"
              },
              {
                text: 'OK', onPress: () => {
                resolve(true);
              },
            }
          ],
          { cancelable: false }
      );
    });
  }

  const openBottomSheetPanel = (index) => {
    descriptionVal = '';
    selectedIndex = index;
    markerPopupVisible(true);
    
    //
    setLoading(!loading);
    setPickedImagePath(null);
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
    markerValueUpdated = false;
    // console.log(formValueToEntity(descriptionVal));
    await updateImageMarker(formValueToEntity(descriptionVal));

    markerPopupVisible(false);

  }

  const createPhotoWithMarker = (imageMarkerId) => {
   if(s3ImageObj != null) {
      let entity = {
        id: null,
        photoName: s3ImageObj.key ?? null,
        photoUploadDate: new Date(),
      };
      entity.imageMarker = { 
        "id": imageMarkerId,   
        "imageMarkerxPos": markerPoints[selectedIndex].imageMarkerxPos, // 394.0078125,
        "imageMarkeryPos": markerPoints[selectedIndex].imageMarkeryPos, //281.46875,
        "imageMarkerDescription": descriptionVal, 
    };
      console.log("entity", entity);
      updatePhoto(entity);
  }
}


  const capturePhoto = () => {
    photoCameraPopupVisible(false);
    setTimeout(()=> openCamera(), 500);
  }

  const selectPhoto = () => {
    photoCameraPopupVisible(false);
    setTimeout(()=> showImagePicker(), 500);
  }

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
    });
    // Explore the result
    console.log(result);
    uploadImageOnS3(result);
  }

  const uploadImageOnS3 = async (result) => {
    if(result != null ) {
     
      
      let markerImage = {
        id : null,
        'url': result.uri,
        'upload_at': true,
      }
      console.log("markerImage",markerImage);
      let pushIntoArray = _.concat(multipleImageState,markerImage);
      console.log("pushIntoArray",pushIntoArray);
      setMultipleImageForMarker(pushIntoArray);
      imageUploadOnAWS(result, pushIntoArray);
    }
  }


  const imageUploadOnAWS = async(result, pushIntoArray) => {
    
    const splitedPath = result.uri.split('/') ;
    const fileName = splitedPath[splitedPath.length - 1] || String(Date.now());
    const contentType = mime.lookup(result.uri);
    console.log(fileName);      
  
    const body = {
      // `uri` can also be a file system path (i.e. file://)
      uri: result.uri, //"assets-library://asset/asset.PNG?id=655DBE66-8008-459C-9358-914E1FB532DD&ext=PNG",
      name: fileName,
      type: contentType
    }

    const options = {
      keyPrefix: "uploads/",
      bucket: "siteappbucket",
      region: "eu-central-1",
      accessKey: AwsConfig.accessKey,
      secretKey: AwsConfig.secretKey,
      successActionStatus: 201
    }
    
    await RNS3.put(body, options).then(response => {
      console.log(response.body);
      if (response.status !== 201)
        throw new Error("Failed to upload image to S3");
      console.log("response.body", response.body);
      console.log("response.body", response.body.postResponse.key);
      if (!result.cancelled) {
        console.log(result.uri);
        s3ImageObj = response.body.postResponse;
      
        pushIntoArray[pushIntoArray.length - 1] = {
          'id': s3ImageObj.etag,
          'url': s3ImageObj.location,
          'upload_at': false
        }
        console.log("pushIntoArray", pushIntoArray);
        setMultipleImageForMarker(pushIntoArray);
        setPickedImagePath(result.uri);
      }
          
      //**
      //  * {       
      //  *   postResponse: {
      //  *     bucket: "your-bucket",
      //  *     etag : "9f620878e06d28774406017480a59fd4",
      //  *     key: "uploads/image.png",
      //  *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
      //  *   }
      //  * }
      //  *
    });
  }

  const pressCloseIcon = async() => {
    if(await manageMarker(selectedIndex)) {
      selectedIndex = null;
      markerPopupVisible(false);
    }
    
  }

  const renderLoading = (upload_at) => {
    console.log("renderLoading",upload_at);
    if(upload_at == false || upload_at == 'false') {
      console.log("SEE");
      return <View />
    }
    console.log("SEE1");
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator size={24} color={'white'} />
      </View>
    )
  }

  const showBottomSheet = () => {
    if(selectedIndex == null || !isVisible) return <View />;
    return (
      // <Modal
      //   animationIn="slideInUp"
      //   animationOut="slideOutDown"
      //   hasBackdrop={false}
      //   coverScreen={false}
      //   backdropOpacity={0}
      //   isVisible={isVisible}
      //   avoidKeyboard={true}
      //   deviceHeight={100}
      //   transparent={true}
      //   onBackdropPress={() => backdropPress()}
      //   propagateSwipe={true}
      //   onSwipeComplete={() => backdropPress()}
      //   swipeDirection={["down"]}
      //   style={{marginRight: 0, marginBottom: 0, marginTop: 0, backgroundColor: 'red', alignSelf: 'flex-end', justifyContent: 'flex-end'}}
      //   onRequestClose={() => backdropPress()}
      // >
     
      <View style={styles.modalPosition}>
          <View style={styles.centeredView}>
            <TouchableOpacity style={styles.closeIcon} onPress={()=> pressCloseIcon()}>
              <MaterialIcons name='close' size={30} color={'#fff'} />
            </TouchableOpacity>
            <View style={styles.modalView}>
              {selectedIndex != null ?
              <TextInput
                style={styles.input}
                onChangeText={(val)=> {
                  descriptionVal = val;
                  markerValueUpdated = true;
                }}
                defaultValue={markerPoints[selectedIndex]?.imageMarkerDescription}
                multiline={true}
                placeholderTextColor={'#666'}
                placeholder="Enter Description"
              /> : null}

              {multipleImageState && multipleImageState.length > 0 ? 
               <View style={styles.markerInfoImageView}>
                {multipleImageState.map((res, index) => {
                  return (
                    <View key={`key_${index}`} style={styles.imageClickableView}>
                      <Image source={{uri: res?.url}} style={styles.markerInfoImage} />
                      {renderLoading(res?.upload_at)}
                    </View>
                  );
                })}
                </View>
                : <View />
              }
             
              {/* {pickedImagePath ?
                <View style={styles.markerInfoImageView}>
                  <Image source={{uri: pickedImagePath}} style={styles.markerInfoImage} />
                </View> : 
                <View />
              } */}

              <View style={styles.buttonFlexRow}>
                <RoundedButton
                  text="Upload Photo"
                  onPress={() => photoCameraPopupVisible(true)}
                  accessibilityLabel={'Marker Update'}
                  testID="markerUpdate"
                  style={[styles.button, styles.buttonClose, styles.buttonHorizontalSpacing]}
                />
                <RoundedButton
                  text="Update"
                  onPress={() => addDescription()}
                  accessibilityLabel={'Marker Update'}
                  testID="markerUpdate"
                  style={[styles.button, styles.buttonClose, styles.buttonHorizontalSpacing]}
                />      
              </View>
              

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
          <PhotoCameraModal 
            isVisible={isVisiblePhotoCameraModal} 
            cancel={()=> photoCameraPopupVisible(false)} 
            openImagePicker={selectPhoto} 
            openCamera={capturePhoto}
          />
       </View>
      // </Modal>
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
    isVisible: state.imageMarkers.markerInfoModalvisible,
    isVisiblePhotoCameraModal: state.imageMarkers.photoCameraModalVisible,
    fetchMarkerList: state.imageMarkers.fetchMarkerList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProjectImageMarkers: (id) => dispatch(ImageMarkerActions.imageMarkerByProjectRequest(id)),
    updateImageMarker: (imageMarker) => dispatch(ImageMarkerActions.imageMarkerUpdateRequest(imageMarker)),
    deleteImageMarker: (id) => dispatch(ImageMarkerActions.imageMarkerDeleteRequest(id)),
    OPTImageMarker: (data) =>  dispatch(ImageMarkerActions.imageMarkerOPT(data)),
    markerPopupVisible: (data) => dispatch(ImageMarkerActions.imageMarkerInfoPopup(data)),
    photoCameraPopupVisible: (data) => dispatch(ImageMarkerActions.photoCameraPopup(data)),
    updatePhoto: (photo) => dispatch(PhotoActions.photoUpdateRequest(photo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectImageMarkerScreen);

