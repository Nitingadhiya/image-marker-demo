// import * as React from 'react';
// import { Provider } from 'react-redux';
// import createStore from './app/shared/reducers';
// import * as SplashScreen from 'expo-splash-screen';

// import NavContainer from './app/navigation/nav-container';

// const store = createStore();

// export default function App() {
//   // prevent the splashscreen from disappearing until the redux store is completely ready (hidden in nav-container.js)
//   const [displayApp, setDisplayApp] = React.useState(false);
//   React.useEffect(() => {
//     if (!displayApp) {
//       SplashScreen.preventAutoHideAsync()
//         .then(() => setDisplayApp(true))
//         .catch(() => setDisplayApp(true));
//     }
//   }, [displayApp, setDisplayApp]);

//   return displayApp ? (
//     <Provider store={store}>
//       <NavContainer />
//     </Provider>
//   ) : null;
// }


// App.js 
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types';
import { Buffer } from "buffer";



function App() {
  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState('');

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();


    // Explore the result
    console.log(result);
    uploadImageOnS3(result);
  }
    
// const uploadImageOnS3 = async (result: any) => { 
//   console.log("RESULT");
// let base64;
//   let options = { 'encoding': FileSystem.EncodingType.Base64 };
//     FileSystem.readAsStringAsync(result.uri, options).then(data => {
//       console.log("base64");
//       base64 = 'data:image/jpg;base64' + data;
//       const fileType = mime.lookup(result.uri);
//       console.log(fileType);
//       let arrayBuffer = Buffer.from(base64, "base64");
//       // console.log(arrayBuffer);
//       // resolve(base64); // are you sure you want to resolve the data and not the base64 string? 
//     }).catch(err => {
//       console.log("​getFile -> err", err);
//       // reject(err) ;
//     });
//   // const base64 = await fs.readFile(result.uri, "base64" ) ;
  
  

//     if (!result.cancelled) {
//       setPickedImagePath(result.uri);
//       console.log(result.uri);
//     }
//   }

  const uploadImageOnS3 = async (result) => {
    // s3bucket = new AWS.S3({
    //   accessKeyId: env.awsAccessKey,
    //   secretAccessKey:env.secretAccesskey,
    //   Bucket: env.awsBucket,
    //   signatureVersion:
    //   'v4'
    // });
    // const base64 = await fs.readfile(result.uri,"base64");
    // const contentType = mime.lookup(result.uri);
    // const splitedPath = result.uri.split('/') ;
    // const file = splitedPath[splitedPath.length - 1];
    // const fileName = file.name || String(Date.now());
    // const arravBuffer = Base64Binary.decode(base64);
    // s3bucket.createBucket(() => {
    //   const params = {
    //     Bucket: env.awsBucket,
    //     Key: fileName,
    //     Body: arrayBuffer,
    //     ContentDisposition: contentDeposition,
    //     ContentType: contentType,
    //   };
    //   s3bucket.upload(params, (err, data) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(data.Location);
    //     }
    //   });
    // });
  }
  

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);Q
      console.log(result.uri);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <Button onPress={showImagePicker} title="Select an image" />
        <Button onPress={openCamera} title="Open camera" />
      </View>

      <View style={styles.imageContainer}>
        {
          pickedImagePath !== '' && <Image
            source={{ uri: pickedImagePath }}
            style={styles.image}
          />
        }
      </View>
    </View>
  );
}

export default App;

// Kindacode.com
// Just some styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 400,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  imageContainer: {
    padding: 30
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: 'cover'
  }
});






// import React from 'react';
// import { Dimensions, View, Image, Text,TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
// import ImageZoom from 'react-native-image-pan-zoom';
// import { MaterialIcons, AntDesign } from '@expo/vector-icons';
// import { useState } from 'react';

// const PinchableBox = () => {

//   const {width, height} = Dimensions.get('window');

//   const [scale, setScale] = useState('');
//   const [addMarker, setAddMarker] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [text, onChangeText] = useState("");

//   const [addedPoints, setPoints] = useState([]);
//   const handleClick = (e) => {
//     console.log('clicked', e);
//       if(addMarker) {
//         let points = [{
//           'x':e.locationX,
//           'y':e.locationY,
//           'label': addedPoints.length + 1
//           }, ...addedPoints];
//           setPoints(points);
//       }   
//   };

//   const showMarker = () => addedPoints.map( (point) => {
//     const xyPosition = { top: point.y, left: point.x };
//     return (
//       <TouchableOpacity key={point.x} style={[styles.markerView, xyPosition]} onPress={()=> openBottomSheetPanel()}>
//         <Text style={{fontSize:10,color: '#fff'}} key={point.x}>{point.label}</Text>
//       </TouchableOpacity>
//     );
//   });

//   const openBottomSheetPanel = () => setModalVisible(true);

//   const showBottomSheet = () => {
//     return (
//       <Modal
//       animationType="slide"
//       transparent={true}
//       visible={modalVisible}
//       onRequestClose={() => {
//         Alert.alert("Modal has been closed.");
//         setModalVisible(!modalVisible);
//       }}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <TextInput
//               style={styles.input}
//               onChangeText={onChangeText}
//               value={text}
//               multiline={true}
//               placeholderTextColor={'#4B4C4E'}
//               placeholder="Description"
//             />
//             <TouchableOpacity
//               style={[styles.button, styles.buttonClose]}
//               onPress={() => setModalVisible(!modalVisible)}
//             >
//               <Text style={styles.textStyle}>Update</Text>
//             </TouchableOpacity>
//             <View style={styles.bottomSections}>
//               <TouchableOpacity style={styles.moveMarker}>
//                 <MaterialIcons name="location-searching" size={30} color="#2196F3" />
//               </TouchableOpacity>
              
//               <TouchableOpacity style={styles.moveMarker}>
//                 <MaterialIcons name="delete-outline" size={30} color="#2196F3" />
//               </TouchableOpacity>
//             </View>
//           </View>

//         </View>
//       </Modal>
//     )
//   };

//   const renderAddMarkerButton = () => (
//     <TouchableOpacity 
//       onPress={()=>{
//         setAddMarker(!addMarker);
//       }} 
//       style={styles.addMarkerButton}
//     >
//     <Text style={styles.addMarkerText}>Add Marker</Text>
//   </TouchableOpacity>
//   );

//   const renderRemoveMarkerButton = () => (
//     <TouchableOpacity onPress={()=>{
//       let addedPoints1 = addedPoints.splice(0, 1);
//       setAddMarker(addedPoints1);
//       }} 
//       style={styles.removeMarkerButton}
//     >
//     <Text style={styles.addMarkerText}>Remover Marker</Text>
//   </TouchableOpacity>
//   );

//   return (
//     <View style={styles.mainView}>
//       {renderAddMarkerButton()}
//       {renderRemoveMarkerButton()}

//       <View style={styles.imagePanView}>
//         <ImageZoom
//           cropWidth={width}
//           cropHeight={height}
//           panToMove={true}
//           minScale={1}
//           maxScale={4}
//           imageHeight={width}
//           onMove={(e) => setScale(e.scale)}
//           imageWidth={width}
//           style={{ marginTop: 0 }}
//           onClick={handleClick}>
//             {showMarker()}
//           <Image
//             style={{ width: width, height: width }}
//             source={{
//               uri: `https://img.parts-catalogs.com/bmw_2020_01/data/JPG/209412.png`,
//             }}
//             resizeMode="contain"
//           />
//         </ImageZoom>
//       </View>
//       {showBottomSheet()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainView: {alignItems: 'center', justifyContent: 'center', height: '100%'},
//   imagePanView: { position: 'relative', alignSelf: 'center' },
//   markerView: {
//     zIndex:99999, 
//     borderRadius:Dimensions.get('window').width * 0.6 / 14,
//     width:Dimensions.get('window').width * 0.6 / 14,
//     height:Dimensions.get('window').width * 0.6 / 14,
//     backgroundColor:'#333',
//     position:'absolute', 
//     borderWidth: 2, 
//     borderColor: '#fff', 
//     shadowColor: "#000",
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 1.84,elevation: 5,
//   },

//   /* Bottom Sheet Style */

//   centeredView: {
//     flex: 1,
//     justifyContent: "flex-end",
//     alignItems: "flex-end",
//     marginTop: 22,
//   },
//   modalView: {
//     // margin: 20,
//     height: Dimensions.get('window').height,
//     backgroundColor: "#1C1C1E",
//     // borderRadius: 20,
//     paddingTop: 35,
//     paddingHorizontal: 20,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     width: Dimensions.get('window').width  - 60
//   },
//   button: {
//     borderRadius: 10,
//     padding: 15,
//     paddingHorizontal: 40,
//     elevation: 2,
//   },
//   buttonOpen: {
//     backgroundColor: "#F194FF",
//   },
//   buttonClose: {
//     backgroundColor: "#2196F3",
//   },
//   textStyle: {
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center"
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: "center"
//   },

//   /* Text Input Style */
//   input: {
//     height: 110,
//     width: '100%',
//     margin: 12,
//     // borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     fontSize: 18,
//     color: '#4B4C4E',
//     backgroundColor: '#29292B'
//   },

//   /*add & remove marker button */
//   addMarkerButton: { zIndex: 10001, height: 50, width: 100, backgroundColor: '#ffcc00', position: 'absolute', top: 50, right: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center'},
//   addMarkerText: { color: '#000', fontSize: 16},
//   removeMarkerButton: { zIndex: 10001, height: 50, width: 100, backgroundColor: '#ffcc00', position: 'absolute', top: 50, right: 130, borderRadius: 10, justifyContent: 'center', alignItems: 'center'},
//   bottomSections: {flex: 1, alignItems: 'flex-end', flexDirection: 'row'},
//   moveMarker: {
//     padding: 10,
//   }
// });




// export default PinchableBox;
